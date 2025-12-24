const Tenant = require("../models/tenant");
const { obtenerMensaje } = require("../helpers/traducciones");

const listarTenants = async (req, res) => {
  const pagina = Number(req.query.pagina) || 1;
  const limite = Number(req.query.limite) || 10;
  const idioma = req.idioma?.codigo || "es";
  try {
    const [items, total] = await Promise.all([
      Tenant.listar(pagina, limite),
      Tenant.contar(),
    ]);
    res.json({ ok: true, items, total });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_LIST_ERROR", idioma);
    res.status(500).json({ ok: false, msg: msg || "Error al listar tenants" });
  }
};

const obtenerTenant = async (req, res) => {
  const { id } = req.params;
  const idioma = req.idioma?.codigo || "es";
  try {
    const item = await Tenant.obtenerPorId(id);
    if (!item) {
      const msg = await obtenerMensaje("TENANT_NOT_FOUND", idioma);
      return res
        .status(404)
        .json({ ok: false, msg: msg || "Tenant no encontrado" });
    }
    res.json({ ok: true, item });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_GET_ERROR", idioma);
    res.status(500).json({ ok: false, msg: msg || "Error al obtener tenant" });
  }
};

const crearTenant = async (req, res) => {
  const idioma = req.idioma?.codigo || "es";
  try {
    const result = await Tenant.crear(req.body);
    const item = await Tenant.obtenerPorId(result.insertId);
    const msg = await obtenerMensaje("TENANT_CREATED", idioma);
    res.status(201).json({ ok: true, item, msg: msg || "Tenant creado" });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_CREATE_ERROR", idioma);
    res.status(500).json({ ok: false, msg: msg || "Error al crear tenant" });
  }
};

const actualizarTenant = async (req, res) => {
  const { id } = req.params;
  const idioma = req.idioma?.codigo || "es";
  try {
    const existe = await Tenant.obtenerPorId(id);
    if (!existe) {
      const msg = await obtenerMensaje("TENANT_NOT_FOUND", idioma);
      return res
        .status(404)
        .json({ ok: false, msg: msg || "Tenant no encontrado" });
    }
    await Tenant.actualizar(id, req.body);
    const item = await Tenant.obtenerPorId(id);
    const msg = await obtenerMensaje("TENANT_UPDATED", idioma);
    res.json({ ok: true, item, msg: msg || "Tenant actualizado" });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_UPDATE_ERROR", idioma);
    res
      .status(500)
      .json({ ok: false, msg: msg || "Error al actualizar tenant" });
  }
};

const eliminarTenant = async (req, res) => {
  const { id } = req.params;
  const idioma = req.idioma?.codigo || "es";
  try {
    const existe = await Tenant.obtenerPorId(id);
    if (!existe) {
      const msg = await obtenerMensaje("TENANT_NOT_FOUND", idioma);
      return res
        .status(404)
        .json({ ok: false, msg: msg || "Tenant no encontrado" });
    }
    await Tenant.eliminar(id);
    const msg = await obtenerMensaje("TENANT_DELETED", idioma);
    res.json({ ok: true, msg: msg || "Tenant eliminado" });
  } catch (error) {
    console.error(error);
    const msg = await obtenerMensaje("GENERIC_DELETE_ERROR", idioma);
    res.status(500).json({ ok: false, msg: msg || "Error al eliminar tenant" });
  }
};

module.exports = {
  listarTenants,
  obtenerTenant,
  crearTenant,
  actualizarTenant,
  eliminarTenant,
};
