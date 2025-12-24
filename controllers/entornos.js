const Entorno = require("../models/entorno");
const { obtenerMensaje } = require("../helpers/traducciones");

const listarEntornos = async (req, res) => {
  const pagina = Number(req.query.pagina) || 1;
  const limite = Number(req.query.limite) || 10;
  const filtro = { id_tenant: req.query.id_tenant };
  const idioma = req.idioma?.codigo || "es";
  try {
    const [items, total] = await Promise.all([
      Entorno.listar(pagina, limite, filtro),
      Entorno.contar(filtro),
    ]);
    res.json({ ok: true, items, total });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_LIST_ERROR", idioma);
    res.status(500).json({ ok: false, msg: msg || "Error al listar entornos" });
  }
};

const obtenerEntorno = async (req, res) => {
  const { id } = req.params;
  const idioma = req.idioma?.codigo || "es";
  try {
    const item = await Entorno.obtenerPorId(id);
    if (!item) {
      const msg = await obtenerMensaje("ENTORNO_NOT_FOUND", idioma);
      return res
        .status(404)
        .json({ ok: false, msg: msg || "Entorno no encontrado" });
    }
    res.json({ ok: true, item });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_GET_ERROR", idioma);
    res.status(500).json({ ok: false, msg: msg || "Error al obtener entorno" });
  }
};

const crearEntorno = async (req, res) => {
  const idioma = req.idioma?.codigo || "es";
  try {
    const result = await Entorno.crear(req.body);
    const item = await Entorno.obtenerPorId(result.insertId);
    const msg = await obtenerMensaje("ENTORNO_CREATED", idioma);
    res.status(201).json({ ok: true, item, msg: msg || "Entorno creado" });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_CREATE_ERROR", idioma);
    res.status(500).json({ ok: false, msg: msg || "Error al crear entorno" });
  }
};

const actualizarEntorno = async (req, res) => {
  const { id } = req.params;
  const idioma = req.idioma?.codigo || "es";
  try {
    const existe = await Entorno.obtenerPorId(id);
    if (!existe) {
      const msg = await obtenerMensaje("ENTORNO_NOT_FOUND", idioma);
      return res
        .status(404)
        .json({ ok: false, msg: msg || "Entorno no encontrado" });
    }
    await Entorno.actualizar(id, req.body);
    const item = await Entorno.obtenerPorId(id);
    const msg = await obtenerMensaje("ENTORNO_UPDATED", idioma);
    res.json({ ok: true, item, msg: msg || "Entorno actualizado" });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_UPDATE_ERROR", idioma);
    res
      .status(500)
      .json({ ok: false, msg: msg || "Error al actualizar entorno" });
  }
};

const eliminarEntorno = async (req, res) => {
  const { id } = req.params;
  const idioma = req.idioma?.codigo || "es";
  try {
    const existe = await Entorno.obtenerPorId(id);
    if (!existe) {
      const msg = await obtenerMensaje("ENTORNO_NOT_FOUND", idioma);
      return res
        .status(404)
        .json({ ok: false, msg: msg || "Entorno no encontrado" });
    }
    await Entorno.eliminar(id);
    const msg = await obtenerMensaje("ENTORNO_DELETED", idioma);
    res.json({ ok: true, msg: msg || "Entorno eliminado" });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_DELETE_ERROR", idioma);
    res
      .status(500)
      .json({ ok: false, msg: msg || "Error al eliminar entorno" });
  }
};

module.exports = {
  listarEntornos,
  obtenerEntorno,
  crearEntorno,
  actualizarEntorno,
  eliminarEntorno,
};
