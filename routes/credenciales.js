/*
    Ruta: /api/credenciales
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const {
  listarPorBoveda,
  buscarPorUrl,
  obtener,
  crear,
  actualizar,
  eliminar,
  listarEtiquetas,
  asignarEtiqueta,
  quitarEtiqueta,
  listarCarpetas,
  asignarCarpeta,
  quitarCarpeta,
  listarCompartidas,
  compartir,
  revocarCompartida,
  listarAdjuntos,
  agregarAdjunto,
  obtenerAdjunto,
  eliminarAdjunto,
  listarHistorial,
} = require("../controllers/gc-credenciales");

const router = Router();

router.get(
  "/boveda/:id_boveda",
  [
    validarJWT,
    check("id_boveda", "No es un ID válido").isNumeric(),
    check("pagina").optional().isInt({ min: 1, max: 1000 }),
    check("limite").optional().isInt({ min: 1, max: 100 }),
    validarCampos,
  ],
  listarPorBoveda
);

router.get(
  "/boveda/:id_boveda/buscar",
  [
    validarJWT,
    check("id_boveda", "No es un ID válido").isNumeric(),
    check("q", "El término de búsqueda (q) es obligatorio").not().isEmpty(),
    check("q").isLength({ min: 1, max: 255 }),
    check("pagina").optional().isInt({ min: 1, max: 1000 }),
    check("limite").optional().isInt({ min: 1, max: 100 }),
    validarCampos,
  ],
  buscarPorUrl
);

router.get(
  "/:id",
  [validarJWT, check("id").isNumeric(), validarCampos],
  obtener
);

router.post(
  "/",
  [
    validarJWT,
    check("id_boveda", "id_boveda es obligatorio").isNumeric(),
    check("titulo", "El título es obligatorio").not().isEmpty(),
    check("contrasena_enc", "contrasena_enc (BLOB/Base64) es obligatorio")
      .not()
      .isEmpty(),
    check("iv_contrasena", "iv_contrasena (BLOB/Base64) es obligatorio")
      .not()
      .isEmpty(),
    check("usuario_cuenta").optional().isString().isLength({ max: 150 }),
    check("url").optional().isURL(),
    check("notas_enc").optional().isString(),
    check("iv_notas").optional().isString(),
    check("totp_secreto_enc").optional().isString(),
    check("iv_totp").optional().isString(),
    check("puntaje_seguridad").optional().isInt({ min: 0, max: 100 }),
    check("estado_brecha")
      .optional()
      .isIn(["NINGUNA", "SOSPECHA", "CONFIRMADA"]),
    check("fecha_expiracion").optional().isISO8601(),
    validarCampos,
  ],
  crear
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id").isNumeric(),
    check("id_boveda").optional().isNumeric(),
    check("titulo").optional().isString().isLength({ min: 1, max: 200 }),
    check("usuario_cuenta").optional().isString().isLength({ max: 150 }),
    check("url").optional().isURL(),
    check("contrasena_enc").optional().not().isEmpty(),
    check("iv_contrasena").optional().not().isEmpty(),
    check("notas_enc").optional().isString(),
    check("iv_notas").optional().isString(),
    check("totp_secreto_enc").optional().isString(),
    check("iv_totp").optional().isString(),
    check("puntaje_seguridad").optional().isInt({ min: 0, max: 100 }),
    check("estado_brecha")
      .optional()
      .isIn(["NINGUNA", "SOSPECHA", "CONFIRMADA"]),
    check("fecha_expiracion").optional().isISO8601(),
    validarCampos,
  ],
  actualizar
);

router.delete(
  "/:id",
  [validarJWT, check("id").isNumeric(), validarCampos],
  eliminar
);

// Etiquetas
router.get(
  "/:id/etiquetas",
  [validarJWT, check("id").isNumeric(), validarCampos],
  listarEtiquetas
);
router.post(
  "/:id/etiquetas",
  [
    validarJWT,
    check("id").isNumeric(),
    check("id_etiqueta", "id_etiqueta es obligatorio").isNumeric(),
    validarCampos,
  ],
  asignarEtiqueta
);
router.delete(
  "/:id/etiquetas/:id_etiqueta",
  [
    validarJWT,
    check("id").isNumeric(),
    check("id_etiqueta").isNumeric(),
    validarCampos,
  ],
  quitarEtiqueta
);

// Carpetas
router.get(
  "/:id/carpetas",
  [validarJWT, check("id").isNumeric(), validarCampos],
  listarCarpetas
);
router.post(
  "/:id/carpetas",
  [
    validarJWT,
    check("id").isNumeric(),
    check("id_carpeta", "id_carpeta es obligatorio").isNumeric(),
    validarCampos,
  ],
  asignarCarpeta
);
router.delete(
  "/:id/carpetas/:id_carpeta",
  [
    validarJWT,
    check("id").isNumeric(),
    check("id_carpeta").isNumeric(),
    validarCampos,
  ],
  quitarCarpeta
);

// Compartidas
router.get(
  "/:id/compartidas",
  [validarJWT, check("id").isNumeric(), validarCampos],
  listarCompartidas
);
router.post(
  "/:id/compartidas",
  [
    validarJWT,
    check("id").isNumeric(),
    check("id_usuario", "id_usuario es obligatorio").isNumeric(),
    check("rol").optional().isIn(["EDITOR", "LECTOR"]),
    validarCampos,
  ],
  compartir
);
router.delete(
  "/:id/compartidas/:id_usuario",
  [
    validarJWT,
    check("id").isNumeric(),
    check("id_usuario").isNumeric(),
    validarCampos,
  ],
  revocarCompartida
);

// Adjuntos
router.get(
  "/:id/adjuntos",
  [validarJWT, check("id").isNumeric(), validarCampos],
  listarAdjuntos
);
router.post(
  "/:id/adjuntos",
  [
    validarJWT,
    check("id").isNumeric(),
    check("nombre_archivo").not().isEmpty(),
    check("contenido_base64").not().isEmpty(),
    check("iv_base64").not().isEmpty(),
    check("mime_type").optional().isString().isLength({ max: 255 }),
    check("tamano_bytes").optional().isInt({ min: 0 }),
    validarCampos,
  ],
  agregarAdjunto
);
router.get(
  "/:id/adjuntos/:id_adjunto",
  [
    validarJWT,
    check("id").isNumeric(),
    check("id_adjunto").isNumeric(),
    validarCampos,
  ],
  obtenerAdjunto
);
router.delete(
  "/:id/adjuntos/:id_adjunto",
  [
    validarJWT,
    check("id").isNumeric(),
    check("id_adjunto").isNumeric(),
    validarCampos,
  ],
  eliminarAdjunto
);

// Historial
router.get(
  "/:id/historial",
  [
    validarJWT,
    check("id").isNumeric(),
    check("pagina").optional().isInt({ min: 1, max: 1000 }),
    check("limite").optional().isInt({ min: 1, max: 200 }),
    validarCampos,
  ],
  listarHistorial
);

module.exports = router;
