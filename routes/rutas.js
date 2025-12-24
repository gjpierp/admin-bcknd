/*
    Ruta: /api/rutas
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarPaginacion } = require("../middlewares/validar-inputs");
const { validarJWT, validarAdminRole } = require("../middlewares/validar-jwt");

const {
  listarRutas,
  obtenerRuta,
  crearRuta,
  actualizarRuta,
  eliminarRuta,
} = require("../controllers/rutas");

const router = Router();

router.get("/", [validarJWT, validarPaginacion], listarRutas);

router.get(
  "/:id",
  [validarJWT, check("id", "No es un ID válido").isNumeric(), validarCampos],
  obtenerRuta
);

router.post(
  "/",
  [
    validarJWT,
    validarAdminRole,
    check("id_sitio", "id_sitio es obligatorio").isNumeric(),
    check("metodo", "El método es obligatorio").not().isEmpty(),
    check("path", "El path es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearRuta
);

router.put(
  "/:id",
  [
    validarJWT,
    validarAdminRole,
    check("id", "No es un ID válido").isNumeric(),
    check("id_sitio").optional().isNumeric(),
    check("metodo").optional().isLength({ min: 3, max: 10 }),
    check("path").optional().isLength({ min: 1, max: 500 }),
    validarCampos,
  ],
  actualizarRuta
);

router.delete(
  "/:id",
  [
    validarJWT,
    validarAdminRole,
    check("id", "No es un ID válido").isNumeric(),
    validarCampos,
  ],
  eliminarRuta
);

module.exports = router;
