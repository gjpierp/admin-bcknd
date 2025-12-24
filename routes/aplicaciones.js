/*
    Ruta: /api/aplicaciones
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarPaginacion } = require("../middlewares/validar-inputs");
const { validarJWT, validarAdminRole } = require("../middlewares/validar-jwt");

const {
  listarAplicaciones,
  obtenerAplicacion,
  crearAplicacion,
  actualizarAplicacion,
  eliminarAplicacion,
} = require("../controllers/aplicaciones");

const router = Router();

router.get("/", [validarJWT, validarPaginacion], listarAplicaciones);

router.get(
  "/:id",
  [validarJWT, check("id", "No es un ID válido").isNumeric(), validarCampos],
  obtenerAplicacion
);

router.post(
  "/",
  [
    validarJWT,
    validarAdminRole,
    check("id_tenant", "id_tenant es obligatorio").isNumeric(),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("tipo", "El tipo es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearAplicacion
);

router.put(
  "/:id",
  [
    validarJWT,
    validarAdminRole,
    check("id", "No es un ID válido").isNumeric(),
    check("id_tenant").optional().isNumeric(),
    check("nombre").optional().isLength({ min: 2, max: 100 }),
    check("tipo").optional().isLength({ min: 2, max: 50 }),
    validarCampos,
  ],
  actualizarAplicacion
);

router.delete(
  "/:id",
  [
    validarJWT,
    validarAdminRole,
    check("id", "No es un ID válido").isNumeric(),
    validarCampos,
  ],
  eliminarAplicacion
);

module.exports = router;
