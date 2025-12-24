/*
    Ruta: /api/tenants
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarPaginacion } = require("../middlewares/validar-inputs");
const { validarJWT, validarAdminRole } = require("../middlewares/validar-jwt");

const {
  listarTenants,
  obtenerTenant,
  crearTenant,
  actualizarTenant,
  eliminarTenant,
} = require("../controllers/tenants");

const router = Router();

router.get("/", [validarJWT, validarPaginacion], listarTenants);

router.get(
  "/:id",
  [validarJWT, check("id", "No es un ID válido").isNumeric(), validarCampos],
  obtenerTenant
);

router.post(
  "/",
  [
    validarJWT,
    validarAdminRole,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("nombre", "El nombre debe tener entre 2 y 100 caracteres").isLength({
      min: 2,
      max: 100,
    }),
    check("slug", "El slug es obligatorio").not().isEmpty(),
    check("slug", "El slug debe tener entre 2 y 100 caracteres").isLength({
      min: 2,
      max: 100,
    }),
    validarCampos,
  ],
  crearTenant
);

router.put(
  "/:id",
  [
    validarJWT,
    validarAdminRole,
    check("id", "No es un ID válido").isNumeric(),
    check("nombre").optional().isLength({ min: 2, max: 100 }),
    check("slug").optional().isLength({ min: 2, max: 100 }),
    validarCampos,
  ],
  actualizarTenant
);

router.delete(
  "/:id",
  [
    validarJWT,
    validarAdminRole,
    check("id", "No es un ID válido").isNumeric(),
    validarCampos,
  ],
  eliminarTenant
);

module.exports = router;
