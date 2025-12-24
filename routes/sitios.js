/*
    Ruta: /api/sitios
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarPaginacion } = require("../middlewares/validar-inputs");
const { validarJWT, validarAdminRole } = require("../middlewares/validar-jwt");

const {
  listarSitios,
  obtenerSitio,
  crearSitio,
  actualizarSitio,
  eliminarSitio,
} = require("../controllers/sitios");

const router = Router();

router.get("/", [validarJWT, validarPaginacion], listarSitios);

router.get(
  "/:id",
  [validarJWT, check("id", "No es un ID válido").isNumeric(), validarCampos],
  obtenerSitio
);

router.post(
  "/",
  [
    validarJWT,
    validarAdminRole,
    check("id_app", "id_app es obligatorio").isNumeric(),
    check("id_entorno", "id_entorno es obligatorio").isNumeric(),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("slug", "El slug es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearSitio
);

router.put(
  "/:id",
  [
    validarJWT,
    validarAdminRole,
    check("id", "No es un ID válido").isNumeric(),
    check("id_app").optional().isNumeric(),
    check("id_entorno").optional().isNumeric(),
    check("nombre").optional().isLength({ min: 2, max: 100 }),
    check("slug").optional().isLength({ min: 2, max: 100 }),
    validarCampos,
  ],
  actualizarSitio
);

router.delete(
  "/:id",
  [
    validarJWT,
    validarAdminRole,
    check("id", "No es un ID válido").isNumeric(),
    validarCampos,
  ],
  eliminarSitio
);

module.exports = router;
