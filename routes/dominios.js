/*
    Ruta: /api/dominios
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarPaginacion } = require("../middlewares/validar-inputs");
const { validarJWT, validarAdminRole } = require("../middlewares/validar-jwt");

const {
  listarDominios,
  obtenerDominio,
  crearDominio,
  actualizarDominio,
  eliminarDominio,
} = require("../controllers/dominios");

const router = Router();

router.get("/", [validarJWT, validarPaginacion], listarDominios);

router.get(
  "/:id",
  [validarJWT, check("id", "No es un ID válido").isNumeric(), validarCampos],
  obtenerDominio
);

router.post(
  "/",
  [
    validarJWT,
    validarAdminRole,
    check("id_sitio", "id_sitio es obligatorio").isNumeric(),
    check("host", "El host es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearDominio
);

router.put(
  "/:id",
  [
    validarJWT,
    validarAdminRole,
    check("id", "No es un ID válido").isNumeric(),
    check("id_sitio").optional().isNumeric(),
    check("host").optional().isLength({ min: 3, max: 255 }),
    validarCampos,
  ],
  actualizarDominio
);

router.delete(
  "/:id",
  [
    validarJWT,
    validarAdminRole,
    check("id", "No es un ID válido").isNumeric(),
    validarCampos,
  ],
  eliminarDominio
);

module.exports = router;
