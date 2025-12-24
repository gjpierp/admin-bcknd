const Pagina = require("../models/pagina");
const { obtenerMensaje } = require("../helpers/traducciones");

const listarPaginas = async (req, res) => {
  const pagina = Number(req.query.pagina) || 1;
  const limite = Number(req.query.limite) || 10;
  const filtro = { id_sitio: req.query.id_sitio };
  const idioma = req.idioma?.codigo || "es";
  try {
    const [items, total] = await Promise.all([
      Pagina.listar(pagina, limite, filtro),
      Pagina.contar(filtro),
    ]);
    res.json({ ok: true, items, total });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_LIST_ERROR", idioma);
    res.status(500).json({ ok: false, msg: msg || "Error al listar páginas" });
  }
};

const obtenerPagina = async (req, res) => {
  const { id } = req.params;
  const idioma = req.idioma?.codigo || "es";
  try {
    const item = await Pagina.obtenerPorId(id);
    if (!item) {
      const msg = await obtenerMensaje("PAGINA_NOT_FOUND", idioma);
      return res
        .status(404)
        .json({ ok: false, msg: msg || "Página no encontrada" });
    }
    res.json({ ok: true, item });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_GET_ERROR", idioma);
    res.status(500).json({ ok: false, msg: msg || "Error al obtener página" });
  }
};

const crearPagina = async (req, res) => {
  const idioma = req.idioma?.codigo || "es";
  try {
    const result = await Pagina.crear(req.body);
    const item = await Pagina.obtenerPorId(result.insertId);
    const msg = await obtenerMensaje("PAGINA_CREATED", idioma);
    res.status(201).json({ ok: true, item, msg: msg || "Página creada" });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_CREATE_ERROR", idioma);
    res.status(500).json({ ok: false, msg: msg || "Error al crear página" });
  }
};

const actualizarPagina = async (req, res) => {
  const { id } = req.params;
  const idioma = req.idioma?.codigo || "es";
  try {
    const existe = await Pagina.obtenerPorId(id);
    if (!existe) {
      const msg = await obtenerMensaje("PAGINA_NOT_FOUND", idioma);
      return res
        .status(404)
        .json({ ok: false, msg: msg || "Página no encontrada" });
    }
    await Pagina.actualizar(id, req.body);
    const item = await Pagina.obtenerPorId(id);
    const msg = await obtenerMensaje("PAGINA_UPDATED", idioma);
    res.json({ ok: true, item, msg: msg || "Página actualizada" });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_UPDATE_ERROR", idioma);
    res
      .status(500)
      .json({ ok: false, msg: msg || "Error al actualizar página" });
  }
};

const eliminarPagina = async (req, res) => {
  const { id } = req.params;
  const idioma = req.idioma?.codigo || "es";
  try {
    const existe = await Pagina.obtenerPorId(id);
    if (!existe) {
      const msg = await obtenerMensaje("PAGINA_NOT_FOUND", idioma);
      return res
        .status(404)
        .json({ ok: false, msg: msg || "Página no encontrada" });
    }
    await Pagina.eliminar(id);
    const msg = await obtenerMensaje("PAGINA_DELETED", idioma);
    res.json({ ok: true, msg: msg || "Página eliminada" });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_DELETE_ERROR", idioma);
    res.status(500).json({ ok: false, msg: msg || "Error al eliminar página" });
  }
};

module.exports = {
  listarPaginas,
  obtenerPagina,
  crearPagina,
  actualizarPagina,
  eliminarPagina,
};
