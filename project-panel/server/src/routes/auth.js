const { Router } = require("express");
const {
  getUsers,
  register,
  login,
  protected,
  logout,
  sepeteEkle,
  sepetim,
  sepetSil,
  siparis,
} = require("../controllers/auth");
const { registerValidation, loginValidation } = require("../validators/auth");
const {
  validationMiddleware,
} = require("../middlewares/validation-middleware");
const { userAuth } = require("../middlewares/auth-middleware");
const router = Router();

router.get("/get-users", getUsers);
router.get("/protected", userAuth, protected);
router.post("/register", registerValidation, validationMiddleware, register);
router.post("/login", loginValidation, validationMiddleware, login);
router.get("/logout", logout);
router.post("/sepete-ekle", userAuth, sepeteEkle);
router.get("/sepetim", userAuth, sepetim);
router.delete("/sepet-sil/:sepetId", userAuth, sepetSil);
router.post("/siparis", userAuth, siparis);

module.exports = router;
