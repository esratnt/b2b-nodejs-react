const { check } = require('express-validator');
const db = require('../db');
const { compare } = require('bcryptjs');

// Şifre
const sifre = check('sifre')
  .isLength({ min: 6, max: 15 })
  .withMessage('Parola 6 ile 15 karakter olmalıdır.');

// Kullanıcı adı
const kullanicadiExist = check('kullaniciadi').custom(async (value) => {
  const { rows } = await db.query('SELECT * from kullanici WHERE kullaniciadi = $1', [value]);
  if (rows.length) {
    throw new Error('Kayıtlı kullanıcı adı bulunmaktadır. Lütfen başka bir kullanıcı adı deneyiniz.');
  }
});

// Telefon
const telefonExist = check('telefon').custom(async (value) => {
  const { rows } = await db.query('SELECT * from kullanici WHERE telefon = $1', [value]);
  if (rows.length) {
    throw new Error('Kayıtlı telefon numarası bulunmaktadır. Lütfen başka bir telefon numarası giriniz.');
  }
});

// Email
const email = check('email')
  .isEmail()
  .withMessage('Lütfen geçerli bir email giriniz.');

// Check if email exists
const emailExists = check('email').custom(async (value) => {
  const { rows } = await db.query('SELECT * from kullanici WHERE email = $1', [value]);
  if (rows.length) {
    throw new Error('Kayıtlı email bulunmaktadır.');
  }
});

// Login validation
const loginFieldCheck = check('kullaniciadi').custom(async (value, { req }) => {
  const user = await db.query('SELECT * from kullanici WHERE kullaniciadi = $1', [value]);
  if (!user.rows.length) {
    throw new Error('Kayıtlı kulanıcı bulunamamaktadır.');
  }

  const validPassword = await compare(req.body.sifre, user.rows[0].sifre);

  if (!validPassword) {
    throw new Error('Yanlış şifre');
  }
  req.user = user.rows[0];
});

module.exports = {
  registerValidation: [email, sifre, emailExists, kullanicadiExist, telefonExist],
  loginValidation: [loginFieldCheck],
};
