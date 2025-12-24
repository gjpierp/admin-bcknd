/*
    Ruta: /api/gc/bovedas
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
