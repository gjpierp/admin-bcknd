const { response } = require("express");
const { check } = require("express-validator");
const GcBoveda = require("../models/gc-boveda");
const db = require("../database/config");

// Helper ACL
async function obtenerRolEnBoveda(id_boveda, uid) {
  const [rows] = await db.query(
    `SELECT CASE WHEN b.id_usuario_dueno = ? THEN 'DUENO' ELSE bm.rol END AS rol
     FROM gc_bovedas b
     LEFT JOIN gc_boveda_miembro bm ON bm.id_boveda = b.id_boveda AND bm.id_usuario = ?
     WHERE b.id_boveda = ?
     LIMIT 1`,
    [uid, uid, id_boveda]
  );
  return rows[0]?.rol || null;
}

const listarMisBovedas = async (req, res = response) => {
  try {
    const uid = req.uid;
    const bovedas = await GcBoveda.listarMiBovedas(uid);
    res.json({ ok: true, bovedas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al listar bóvedas" });
  }
};

const crearBoveda = async (req, res = response) => {
  try {
    const uid = req.uid;
    const { nombre, tipo, clave_boveda_enc, iv_boveda } = req.body;
    const result = await GcBoveda.crear({
      id_usuario_dueno: uid,
      nombre,
      tipo,
      clave_boveda_enc,
      iv_boveda,
    });
    const boveda = await GcBoveda.obtenerPorId(result.insertId);
    res.status(201).json({ ok: true, boveda });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al crear bóveda" });
  }
};

const actualizarBoveda = async (req, res = response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const uid = req.uid;
    const rolEnBoveda = await obtenerRolEnBoveda(id, uid);
    if (!(rolEnBoveda === "DUENO" || rolEnBoveda === "ADMIN"))
      return res
        .status(403)
        .json({ ok: false, msg: "Sin permiso para actualizar la bóveda" });
    const { nombre, tipo, clave_boveda_enc, iv_boveda } = req.body;
    await GcBoveda.actualizar(id, {
      nombre,
      tipo,
      clave_boveda_enc,
      iv_boveda,
    });
    const boveda = await GcBoveda.obtenerPorId(id);
    res.json({ ok: true, boveda });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al actualizar bóveda" });
  }
};

const eliminarBoveda = async (req, res = response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const uid = req.uid;
    const rolEnBoveda = await obtenerRolEnBoveda(id, uid);
    if (!(rolEnBoveda === "DUENO" || rolEnBoveda === "ADMIN"))
      return res
        .status(403)
        .json({ ok: false, msg: "Sin permiso para eliminar la bóveda" });
    await GcBoveda.eliminar(id);
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al eliminar bóveda" });
  }
};

const listarMiembros = async (req, res = response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const uid = req.uid;
    const rolEnBoveda = await obtenerRolEnBoveda(id, uid);
    if (!(rolEnBoveda === "DUENO" || rolEnBoveda === "ADMIN"))
      return res
        .status(403)
        .json({ ok: false, msg: "Sin permiso para listar miembros" });
    const miembros = await GcBoveda.listarMiembros(id);
    res.json({ ok: true, miembros });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al listar miembros" });
  }
};

const agregarMiembro = async (req, res = response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const uid = req.uid;
    const rolEnBoveda = await obtenerRolEnBoveda(id, uid);
    if (!(rolEnBoveda === "DUENO" || rolEnBoveda === "ADMIN"))
      return res
        .status(403)
        .json({ ok: false, msg: "Sin permiso para agregar miembros" });
    const { id_usuario, rol } = req.body;
    await GcBoveda.agregarMiembro(id, id_usuario, rol || "LECTOR");
    const miembros = await GcBoveda.listarMiembros(id);
    res.status(201).json({ ok: true, miembros });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al agregar miembro" });
  }
};

const eliminarMiembro = async (req, res = response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const uid = req.uid;
    const rolEnBoveda = await obtenerRolEnBoveda(id, uid);
    if (!(rolEnBoveda === "DUENO" || rolEnBoveda === "ADMIN"))
      return res
        .status(403)
        .json({ ok: false, msg: "Sin permiso para eliminar miembros" });
    const id_usuario = parseInt(req.params.id_usuario, 10);
    await GcBoveda.eliminarMiembro(id, id_usuario);
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al eliminar miembro" });
  }
};

module.exports = {
  listarMisBovedas,
  crearBoveda,
  actualizarBoveda,
  eliminarBoveda,
  listarMiembros,
  agregarMiembro,
  eliminarMiembro,
};
