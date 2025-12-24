const Sitio = require("../models/sitio");
const { obtenerMensaje } = require("../helpers/traducciones");

const listarSitios = async (req, res) => {
  const pagina = Number(req.query.pagina) || 1;
  const limite = Number(req.query.limite) || 10;
  const filtro = { id_app: req.query.id_app, id_entorno: req.query.id_entorno };
  const idioma = req.idioma?.codigo || "es";
  try {
    const [items, total] = await Promise.all([
      Sitio.listar(pagina, limite, filtro),
      Sitio.contar(filtro),
    ]);
    res.json({ ok: true, items, total });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_LIST_ERROR", idioma);
    res.status(500).json({ ok: false, msg: msg || "Error al listar sitios" });
  }
};

const obtenerSitio = async (req, res) => {
  const { id } = req.params;
  const idioma = req.idioma?.codigo || "es";
  try {
    const item = await Sitio.obtenerPorId(id);
    if (!item) {
      const msg = await obtenerMensaje("SITIO_NOT_FOUND", idioma);
      return res
        .status(404)
        .json({ ok: false, msg: msg || "Sitio no encontrado" });
    }
    res.json({ ok: true, item });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_GET_ERROR", idioma);
    res.status(500).json({ ok: false, msg: msg || "Error al obtener sitio" });
  }
};

const crearSitio = async (req, res) => {
  const idioma = req.idioma?.codigo || "es";
  try {
    const result = await Sitio.crear(req.body);
    const item = await Sitio.obtenerPorId(result.insertId);
    const msg = await obtenerMensaje("SITIO_CREATED", idioma);
    res.status(201).json({ ok: true, item, msg: msg || "Sitio creado" });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_CREATE_ERROR", idioma);
    res.status(500).json({ ok: false, msg: msg || "Error al crear sitio" });
  }
};

const actualizarSitio = async (req, res) => {
  const { id } = req.params;
  const idioma = req.idioma?.codigo || "es";
  try {
    const existe = await Sitio.obtenerPorId(id);
    if (!existe) {
      const msg = await obtenerMensaje("SITIO_NOT_FOUND", idioma);
      return res
        .status(404)
        .json({ ok: false, msg: msg || "Sitio no encontrado" });
    }
    await Sitio.actualizar(id, req.body);
    const item = await Sitio.obtenerPorId(id);
    const msg = await obtenerMensaje("SITIO_UPDATED", idioma);
    res.json({ ok: true, item, msg: msg || "Sitio actualizado" });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_UPDATE_ERROR", idioma);
    res
      .status(500)
      .json({ ok: false, msg: msg || "Error al actualizar sitio" });
  }
};

const eliminarSitio = async (req, res) => {
  const { id } = req.params;
  const idioma = req.idioma?.codigo || "es";
  try {
    const existe = await Sitio.obtenerPorId(id);
    if (!existe) {
      const msg = await obtenerMensaje("SITIO_NOT_FOUND", idioma);
      return res
        .status(404)
        .json({ ok: false, msg: msg || "Sitio no encontrado" });
    }
    await Sitio.eliminar(id);
    const msg = await obtenerMensaje("SITIO_DELETED", idioma);
    res.json({ ok: true, msg: msg || "Sitio eliminado" });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_DELETE_ERROR", idioma);
    res.status(500).json({ ok: false, msg: msg || "Error al eliminar sitio" });
  }
};

module.exports = {
  listarSitios,
  obtenerSitio,
  crearSitio,
  actualizarSitio,
  eliminarSitio,
};
