/*
    Ruta: /api/entornos
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarPaginacion } = require("../middlewares/validar-inputs");
const { validarJWT, validarAdminRole } = require("../middlewares/validar-jwt");

const {
  listarEntornos,
  obtenerEntorno,
  crearEntorno,
  actualizarEntorno,
  eliminarEntorno,
} = require("../controllers/entornos");

const router = Router();

router.get("/", [validarJWT, validarPaginacion], listarEntornos);

router.get(
  "/:id",
  [validarJWT, check("id", "No es un ID válido").isNumeric(), validarCampos],
  obtenerEntorno
);

router.post(
  "/",
  [
    validarJWT,
    validarAdminRole,
    check("id_tenant", "id_tenant es obligatorio").isNumeric(),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("codigo", "El código es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearEntorno
);

router.put(
  "/:id",
  [
    validarJWT,
    validarAdminRole,
    check("id", "No es un ID válido").isNumeric(),
    check("id_tenant").optional().isNumeric(),
    check("nombre").optional().isLength({ min: 2, max: 100 }),
    check("codigo").optional().isLength({ min: 1, max: 50 }),
    validarCampos,
  ],
  actualizarEntorno
);

router.delete(
  "/:id",
  [
    validarJWT,
    validarAdminRole,
    check("id", "No es un ID válido").isNumeric(),
    validarCampos,
  ],
  eliminarEntorno
);

module.exports = router;
