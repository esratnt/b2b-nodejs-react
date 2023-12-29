const db = require("../db");
const { hash } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { SECRET } = require("../constants");
const { Pool } = require("pg");

exports.getUsers = async (req, res) => {
  try {
    const { rows } = await db.query("select * from kullanici");
    return res.status(200).json({
      succes: true,
      kullanici: rows,
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.register = async (req, res) => {
  const { isim, soyisim, sirket, kullaniciadi, telefon, vade, email, sifre } =
    req.body;
  try {
    const hashedPassword = await hash(sifre, 10);

    await db.query(
      "INSERT INTO kullanici(isim,soyisim,sirket,kullaniciadi,telefon,vade,email,sifre) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        isim,
        soyisim,
        sirket,
        kullaniciadi,
        telefon,
        vade,
        email,
        hashedPassword,
      ]
    );

    return res.status(201).json({
      succes: true,
      message: "Kaydınız başarıyla tamamlanmıştır",
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  let user = req.user;
  payload = {
    id: user.kullanici_id,
    kullaniciadi: user.kullaniciadi,
  };
  try {
    const token = await sign(payload, SECRET);
    return res.status(200).cookie("token", token, { httpOnly: true }).json({
      succes: true,
      message: "Giriş başarılı",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.protected = async (req, res) => {
  try {
    const user = req.user;

    // Eğer kullanıcı yetkilendirilmişse, korunan bilgileri döndür
    if (user) {
      // Kullanıcı yetkilendirilmişse, ürün bilgilerini çek
      const { rows } = await db.query("SELECT * FROM urunler");
      return res.status(200).json({
        info: "protected info",
        user: user,
        products: rows,
      });
    } else {
      // Eğer kullanıcı yetkilendirilmemişse, hata döndür
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    return res.status(200).clearCookie("token", { httpOnly: true }).json({
      succes: true,
      message: "Çıkış başarılı",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

//sepete ekle
exports.sepeteEkle = async (req, res) => {
  try {
    const user = req.user;
    const { urun_id, adet } = req.body;

    // Kullanıcının sepetine eklenmiş bir öğe var mı kontrol et
    const existingCartItemQuery =
      "SELECT * FROM sepet WHERE kullanici_id = $1 AND urun_id = $2 AND durum = 'Active'";
    const existingCartItemResult = await db.query(existingCartItemQuery, [
      user.id,
      urun_id,
    ]);

    if (existingCartItemResult.rows.length > 0) {
      // Eğer öğe zaten ekliyse, miktarı güncelle
      const existingCartItem = existingCartItemResult.rows[0];
      const updatedQuantity = parseInt(existingCartItem.adet) + parseInt(adet);

      await db.query("UPDATE sepet SET adet = $1 WHERE sepet_id = $2", [
        updatedQuantity,
        existingCartItem.sepet_id,
      ]);
    } else {
      // Eğer öğe daha önce eklenmemişse, yeni bir öğe olarak ekle
      await db.query(
        "INSERT INTO sepet (kullanici_id, urun_id, adet) VALUES ($1, $2, $3)",
        [user.id, urun_id, adet]
      );
    }

    return res.status(200).json({
      success: true,
      message: "Ürün sepete eklendi",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.sepetim = async (req, res) => {
  try {
    const user = req.user;
    const sepetQuery =
      "SELECT sepet.sepet_id, sepet.adet, urunler.* FROM sepet JOIN urunler ON sepet.urun_id = urunler.id WHERE kullanici_id = $1 AND sepet.durum = 'Active'";
    const sepetResults = await db.query(sepetQuery, [user.id]);

    const sepetim = sepetResults.rows.map((sepetItem) => {
      return {
        sepet_id: sepetItem.sepet_id,
        adet: sepetItem.adet,
        stok_kodu: sepetItem.stok_kodu,
        arac: sepetItem.arac,
        urun: sepetItem.urun,
        fiyat: sepetItem.fiyat,
        kdv: sepetItem.kdv,
      };
    });

    return res.status(200).json({
      success: true,
      sepet: sepetim,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
exports.sepetSil = async (req, res) => {
  try {
    const user = req.user;
    const sepetId = req.params.sepetId;

    // Kullanıcının kendi sepetinden silme işlemi yapmasını kontrol et
    const deleteCartItemQuery =
      "DELETE FROM sepet WHERE sepet_id = $1 AND kullanici_id = $2 AND durum = 'Active'";
    const deleteCartItemResult = await db.query(deleteCartItemQuery, [
      sepetId,
      user.id,
    ]);

    if (deleteCartItemResult.rowCount > 0) {
      // Başarılı yanıt
      return res.status(200).json({
        success: true,
        message: "Ürün sepetten silindi.",
      });
    } else {
      // Kullanıcıya ait olmayan bir öğe silinmeye çalışıldığında hata döndür
      return res.status(403).json({
        error:
          "Bu işlemi yapmaya yetkiniz yok veya öğe zaten silinmiş olabilir.",
      });
    }
  } catch (error) {
    console.error("Ürün sepetten silinirken hata oluştu:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
// Sipariş oluşturma işlemi
exports.siparis = async (req, res) => {
  try {
    const user = req.user;

    // Kullanıcının sepetindeki active ürünleri getir
    const activeCartItemsQuery =
      "SELECT sepet.adet, sepet.urun_id, urunler.fiyat , urunler.kdv FROM sepet JOIN urunler ON sepet.urun_id = urunler.id WHERE sepet.kullanici_id = $1 AND sepet.durum = 'Active'";
    const activeCartItemsResult = await db.query(activeCartItemsQuery, [
      user.id,
    ]);

    if (activeCartItemsResult.rows.length === 0) {
      return res.status(400).json({
        error: "Sepetinizde aktif durumda ürün bulunmamaktadır.",
      });
    }

    // Kullanıcıdan gelen gönderi şekli ve sipariş notu bilgileri
    const { gonderi_sekli, siparis_notu } = req.body;

    // Sipariş tablosuna yeni bir sipariş ekleyin
    const newOrderQuery =
      "INSERT INTO siparis (durum, kullanici_id, gonderi_sekli, siparis_notu) VALUES ($1, $2, $3, $4) RETURNING siparis_id";
    const newOrderResult = await db.query(newOrderQuery, [
      "Pending", // Varsayılan durumu "Beklemede" olarak ayarlayabilirsiniz.
      user.id,
      gonderi_sekli,
      siparis_notu,
    ]);

    const orderId = newOrderResult.rows[0].siparis_id;

    let totalOrderPrice = 0;

    // Her bir sepet öğesini sipariş detay tablosuna ekleyin
    for (const cartItem of activeCartItemsResult.rows) {
      const { urun_id, adet, fiyat, kdv } = cartItem;

      // Sipariş detay tablosuna yeni bir kayıt ekleyin
      await db.query(
        "INSERT INTO siparis_urun (siparis_id, urun_id, adet, fiyat,kdv) VALUES ($1, $2, $3, $4, $5)",
        [orderId, urun_id, adet, fiyat, kdv]
      );

      totalOrderPrice += adet * fiyat;
    }

    // Sipariş tablosunu güncelleyin
    await db.query(
      "UPDATE siparis SET toplam_fiyat = $1 WHERE siparis_id = $2",
      [totalOrderPrice, orderId]
    );

    // Sepeti temizle
    await db.query(
      "DELETE FROM sepet WHERE kullanici_id = $1 AND durum = 'Active'",
      [user.id]
    );

    return res.status(201).json({
      success: true,
      message: "Sipariş başarıyla oluşturuldu.",
    });
  } catch (error) {
    console.error("Sipariş oluşturulurken hata oluştu:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
