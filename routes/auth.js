/*
    Path: '/api/login'
*/
const { Router } = require("express");
const {
  login,
  googleSignIn,
  facebookSignIn,
  renewToken,
} = require("../controllers/auth");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post("/", login, [
  check("correo_electronico")
    .not()
    .isEmpty()
    .withMessage("El correo electrónico es obligatorio")
    .bail()
    .isEmail()
    .withMessage("El correo electrónico debe ser válido"),
  check("contrasena")
    .not()
    .isEmpty()
    .withMessage("La contraseña es obligatoria")
    .bail()
    .isString()
    .withMessage("La contraseña debe ser texto")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  validarCampos,
]);

router.post(
  "/google",
  [
    check("token", "El token de Google es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  googleSignIn
);

router.post(
  "/facebook",
  [
    check("accessToken", "El token de acceso de Facebook es obligatorio")
      .not()
      .isEmpty(),
    validarCampos,
  ],
  facebookSignIn
);

router.get("/renew", validarJWT, renewToken);

module.exports = router;
