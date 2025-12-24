const Aplicacion = require("../models/aplicacion");
const { obtenerMensaje } = require("../helpers/traducciones");

const listarAplicaciones = async (req, res) => {
  const pagina = Number(req.query.pagina) || 1;
  const limite = Number(req.query.limite) || 10;
  const filtro = { id_tenant: req.query.id_tenant };
  const idioma = req.idioma?.codigo || "es";
  try {
    const [items, total] = await Promise.all([
      Aplicacion.listar(pagina, limite, filtro),
      Aplicacion.contar(filtro),
    ]);
    res.json({ ok: true, items, total });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_LIST_ERROR", idioma);
    res
      .status(500)
      .json({ ok: false, msg: msg || "Error al listar aplicaciones" });
  }
};

const obtenerAplicacion = async (req, res) => {
  const { id } = req.params;
  const idioma = req.idioma?.codigo || "es";
  try {
    const item = await Aplicacion.obtenerPorId(id);
    if (!item) {
      const msg = await obtenerMensaje("APP_NOT_FOUND", idioma);
      return res
        .status(404)
        .json({ ok: false, msg: msg || "Aplicación no encontrada" });
    }
    res.json({ ok: true, item });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_GET_ERROR", idioma);
    res
      .status(500)
      .json({ ok: false, msg: msg || "Error al obtener aplicación" });
  }
};

const crearAplicacion = async (req, res) => {
  const idioma = req.idioma?.codigo || "es";
  try {
    const result = await Aplicacion.crear(req.body);
    const item = await Aplicacion.obtenerPorId(result.insertId);
    const msg = await obtenerMensaje("APP_CREATED", idioma);
    res.status(201).json({ ok: true, item, msg: msg || "Aplicación creada" });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_CREATE_ERROR", idioma);
    res
      .status(500)
      .json({ ok: false, msg: msg || "Error al crear aplicación" });
  }
};

const actualizarAplicacion = async (req, res) => {
  const { id } = req.params;
  const idioma = req.idioma?.codigo || "es";
  try {
    const existe = await Aplicacion.obtenerPorId(id);
    if (!existe) {
      const msg = await obtenerMensaje("APP_NOT_FOUND", idioma);
      return res
        .status(404)
        .json({ ok: false, msg: msg || "Aplicación no encontrada" });
    }
    await Aplicacion.actualizar(id, req.body);
    const item = await Aplicacion.obtenerPorId(id);
    const msg = await obtenerMensaje("APP_UPDATED", idioma);
    res.json({ ok: true, item, msg: msg || "Aplicación actualizada" });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_UPDATE_ERROR", idioma);
    res
      .status(500)
      .json({ ok: false, msg: msg || "Error al actualizar aplicación" });
  }
};

const eliminarAplicacion = async (req, res) => {
  const { id } = req.params;
  const idioma = req.idioma?.codigo || "es";
  try {
    const existe = await Aplicacion.obtenerPorId(id);
    if (!existe) {
      const msg = await obtenerMensaje("APP_NOT_FOUND", idioma);
      return res
        .status(404)
        .json({ ok: false, msg: msg || "Aplicación no encontrada" });
    }
    await Aplicacion.eliminar(id);
    const msg = await obtenerMensaje("APP_DELETED", idioma);
    res.json({ ok: true, msg: msg || "Aplicación eliminada" });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_DELETE_ERROR", idioma);
    res
      .status(500)
      .json({ ok: false, msg: msg || "Error al eliminar aplicación" });
  }
};

module.exports = {
  listarAplicaciones,
  obtenerAplicacion,
  crearAplicacion,
  actualizarAplicacion,
  eliminarAplicacion,
};
