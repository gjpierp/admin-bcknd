const Dominio = require("../models/dominio");
const { obtenerMensaje } = require("../helpers/traducciones");

const listarDominios = async (req, res) => {
  const pagina = Number(req.query.pagina) || 1;
  const limite = Number(req.query.limite) || 10;
  const filtro = { id_sitio: req.query.id_sitio };
  const idioma = req.idioma?.codigo || "es";
  try {
    const [items, total] = await Promise.all([
      Dominio.listar(pagina, limite, filtro),
      Dominio.contar(filtro),
    ]);
    res.json({ ok: true, items, total });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_LIST_ERROR", idioma);
    res.status(500).json({ ok: false, msg: msg || "Error al listar dominios" });
  }
};

const obtenerDominio = async (req, res) => {
  const { id } = req.params;
  const idioma = req.idioma?.codigo || "es";
  try {
    const item = await Dominio.obtenerPorId(id);
    if (!item) {
      const msg = await obtenerMensaje("DOMINIO_NOT_FOUND", idioma);
      return res
        .status(404)
        .json({ ok: false, msg: msg || "Dominio no encontrado" });
    }
    res.json({ ok: true, item });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_GET_ERROR", idioma);
    res.status(500).json({ ok: false, msg: msg || "Error al obtener dominio" });
  }
};

const crearDominio = async (req, res) => {
  const idioma = req.idioma?.codigo || "es";
  try {
    const result = await Dominio.crear(req.body);
    const item = await Dominio.obtenerPorId(result.insertId);
    const msg = await obtenerMensaje("DOMINIO_CREATED", idioma);
    res.status(201).json({ ok: true, item, msg: msg || "Dominio creado" });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_CREATE_ERROR", idioma);
    res.status(500).json({ ok: false, msg: msg || "Error al crear dominio" });
  }
};

const actualizarDominio = async (req, res) => {
  const { id } = req.params;
  const idioma = req.idioma?.codigo || "es";
  try {
    const existe = await Dominio.obtenerPorId(id);
    if (!existe) {
      const msg = await obtenerMensaje("DOMINIO_NOT_FOUND", idioma);
      return res
        .status(404)
        .json({ ok: false, msg: msg || "Dominio no encontrado" });
    }
    await Dominio.actualizar(id, req.body);
    const item = await Dominio.obtenerPorId(id);
    const msg = await obtenerMensaje("DOMINIO_UPDATED", idioma);
    res.json({ ok: true, item, msg: msg || "Dominio actualizado" });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_UPDATE_ERROR", idioma);
    res
      .status(500)
      .json({ ok: false, msg: msg || "Error al actualizar dominio" });
  }
};

const eliminarDominio = async (req, res) => {
  const { id } = req.params;
  const idioma = req.idioma?.codigo || "es";
  try {
    const existe = await Dominio.obtenerPorId(id);
    if (!existe) {
      const msg = await obtenerMensaje("DOMINIO_NOT_FOUND", idioma);
      return res
        .status(404)
        .json({ ok: false, msg: msg || "Dominio no encontrado" });
    }
    await Dominio.eliminar(id);
    const msg = await obtenerMensaje("DOMINIO_DELETED", idioma);
    res.json({ ok: true, msg: msg || "Dominio eliminado" });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_DELETE_ERROR", idioma);
    res
      .status(500)
      .json({ ok: false, msg: msg || "Error al eliminar dominio" });
  }
};

module.exports = {
  listarDominios,
  obtenerDominio,
  crearDominio,
  actualizarDominio,
  eliminarDominio,
};
