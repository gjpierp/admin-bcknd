/*
    Ruta: /api/paginas
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarPaginacion } = require("../middlewares/validar-inputs");
const { validarJWT, validarAdminRole } = require("../middlewares/validar-jwt");

const {
  listarPaginas,
  obtenerPagina,
  crearPagina,
  actualizarPagina,
  eliminarPagina,
} = require("../controllers/paginas");

const router = Router();

router.get("/", [validarJWT, validarPaginacion], listarPaginas);

router.get(
  "/:id",
  [validarJWT, check("id", "No es un ID válido").isNumeric(), validarCampos],
  obtenerPagina
);

router.post(
  "/",
  [
    validarJWT,
    validarAdminRole,
    check("id_sitio", "id_sitio es obligatorio").isNumeric(),
    check("titulo", "El título es obligatorio").not().isEmpty(),
    check("slug", "El slug es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearPagina
);

router.put(
  "/:id",
  [
    validarJWT,
    validarAdminRole,
    check("id", "No es un ID válido").isNumeric(),
    check("id_sitio").optional().isNumeric(),
    check("titulo").optional().isLength({ min: 2, max: 200 }),
    check("slug").optional().isLength({ min: 2, max: 200 }),
    validarCampos,
  ],
  actualizarPagina
);

router.delete(
  "/:id",
  [
    validarJWT,
    validarAdminRole,
    check("id", "No es un ID válido").isNumeric(),
    validarCampos,
  ],
  eliminarPagina
);

module.exports = router;
