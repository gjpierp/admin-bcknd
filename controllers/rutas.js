const Ruta = require("../models/ruta");
const { obtenerMensaje } = require("../helpers/traducciones");

const listarRutas = async (req, res) => {
  const pagina = Number(req.query.pagina) || 1;
  const limite = Number(req.query.limite) || 10;
  const filtro = { id_sitio: req.query.id_sitio };
  const idioma = req.idioma?.codigo || "es";
  try {
    const [items, total] = await Promise.all([
      Ruta.listar(pagina, limite, filtro),
      Ruta.contar(filtro),
    ]);
    res.json({ ok: true, items, total });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_LIST_ERROR", idioma);
    res.status(500).json({ ok: false, msg: msg || "Error al listar rutas" });
  }
};

const obtenerRuta = async (req, res) => {
  const { id } = req.params;
  const idioma = req.idioma?.codigo || "es";
  try {
    const item = await Ruta.obtenerPorId(id);
    if (!item) {
      const msg = await obtenerMensaje("RUTA_NOT_FOUND", idioma);
      return res
        .status(404)
        .json({ ok: false, msg: msg || "Ruta no encontrada" });
    }
    res.json({ ok: true, item });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_GET_ERROR", idioma);
    res.status(500).json({ ok: false, msg: msg || "Error al obtener ruta" });
  }
};

const crearRuta = async (req, res) => {
  const idioma = req.idioma?.codigo || "es";
  try {
    const result = await Ruta.crear(req.body);
    const item = await Ruta.obtenerPorId(result.insertId);
    const msg = await obtenerMensaje("RUTA_CREATED", idioma);
    res.status(201).json({ ok: true, item, msg: msg || "Ruta creada" });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_CREATE_ERROR", idioma);
    res.status(500).json({ ok: false, msg: msg || "Error al crear ruta" });
  }
};

const actualizarRuta = async (req, res) => {
  const { id } = req.params;
  const idioma = req.idioma?.codigo || "es";
  try {
    const existe = await Ruta.obtenerPorId(id);
    if (!existe) {
      const msg = await obtenerMensaje("RUTA_NOT_FOUND", idioma);
      return res
        .status(404)
        .json({ ok: false, msg: msg || "Ruta no encontrada" });
    }
    await Ruta.actualizar(id, req.body);
    const item = await Ruta.obtenerPorId(id);
    const msg = await obtenerMensaje("RUTA_UPDATED", idioma);
    res.json({ ok: true, item, msg: msg || "Ruta actualizada" });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_UPDATE_ERROR", idioma);
    res.status(500).json({ ok: false, msg: msg || "Error al actualizar ruta" });
  }
};

const eliminarRuta = async (req, res) => {
  const { id } = req.params;
  const idioma = req.idioma?.codigo || "es";
  try {
    const existe = await Ruta.obtenerPorId(id);
    if (!existe) {
      const msg = await obtenerMensaje("RUTA_NOT_FOUND", idioma);
      return res
        .status(404)
        .json({ ok: false, msg: msg || "Ruta no encontrada" });
    }
    await Ruta.eliminar(id);
    const msg = await obtenerMensaje("RUTA_DELETED", idioma);
    res.json({ ok: true, msg: msg || "Ruta eliminada" });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_DELETE_ERROR", idioma);
    res.status(500).json({ ok: false, msg: msg || "Error al eliminar ruta" });
  }
};

module.exports = {
  listarRutas,
  obtenerRuta,
  crearRuta,
  actualizarRuta,
  eliminarRuta,
};
