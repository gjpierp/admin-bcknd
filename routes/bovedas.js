/*
    Ruta: /api/bovedas
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const {
  listarMisBovedas,
  crearBoveda,
  actualizarBoveda,
  eliminarBoveda,
  listarMiembros,
  agregarMiembro,
  eliminarMiembro,
} = require("../controllers/gc-bovedas");

const router = Router();

router.get("/", [validarJWT], listarMisBovedas);

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("tipo").optional().isIn(["PERSONAL", "COMPARTIDA"]),
    check("clave_boveda_enc", "La clave cifrada de la bóveda es obligatoria")
      .not()
      .isEmpty(),
    check("iv_boveda", "El IV de la bóveda es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearBoveda
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isNumeric(),
    check("tipo").optional().isIn(["PERSONAL", "COMPARTIDA"]),
    check("nombre").optional().isString().isLength({ min: 1, max: 150 }),
    check("clave_boveda_enc").optional().not().isEmpty(),
    check("iv_boveda").optional().not().isEmpty(),
    validarCampos,
  ],
  actualizarBoveda
);

router.delete(
  "/:id",
  [validarJWT, check("id", "No es un ID válido").isNumeric(), validarCampos],
  eliminarBoveda
);

// Miembros
router.get(
  "/:id/miembros",
  [validarJWT, check("id", "No es un ID válido").isNumeric(), validarCampos],
  listarMiembros
);

router.post(
  "/:id/miembros",
  [
    validarJWT,
    check("id", "No es un ID válido").isNumeric(),
    check("id_usuario", "id_usuario es obligatorio").isNumeric(),
    check("rol").optional().isIn(["DUENO", "ADMIN", "EDITOR", "LECTOR"]),
    validarCampos,
  ],
  agregarMiembro
);

router.delete(
  "/:id/miembros/:id_usuario",
  [
    validarJWT,
    check("id", "No es un ID válido").isNumeric(),
    check("id_usuario", "No es un ID válido").isNumeric(),
    validarCampos,
  ],
  eliminarMiembro
);

module.exports = router;
