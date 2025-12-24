const { response } = require("express");
const GcCredencial = require("../models/gc-credencial");
const db = require("../database/config");

// Helpers ACL
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

async function tieneLecturaCredencial(id_credencial, uid) {
  const cred = await GcCredencial.obtenerPorId(id_credencial);
  if (!cred) return false;
  const rol = await obtenerRolEnBoveda(cred.id_boveda, uid);
  if (rol) return true; // miembro o dueño
  const [rows] = await db.query(
    `SELECT rol FROM gc_credencial_compartida WHERE id_credencial = ? AND id_usuario = ? AND estado = 'ACTIVA' LIMIT 1`,
    [id_credencial, uid]
  );
  return !!rows[0];
}

async function tieneEscrituraCredencial(id_credencial, uid) {
  const cred = await GcCredencial.obtenerPorId(id_credencial);
  if (!cred) return false;
  const rol = await obtenerRolEnBoveda(cred.id_boveda, uid);
  if (rol === "DUENO" || rol === "ADMIN" || rol === "EDITOR") return true;
  const [rows] = await db.query(
    `SELECT rol FROM gc_credencial_compartida WHERE id_credencial = ? AND id_usuario = ? AND estado = 'ACTIVA' LIMIT 1`,
    [id_credencial, uid]
  );
  return rows[0]?.rol === "EDITOR";
}

const listarPorBoveda = async (req, res = response) => {
  try {
    const id_boveda = parseInt(req.params.id_boveda, 10);
    const uid = req.uid;
    const rolEnBoveda = await obtenerRolEnBoveda(id_boveda, uid);
    if (!rolEnBoveda)
      return res.status(403).json({ ok: false, msg: "Sin acceso a la bóveda" });
    const pagina = Number(req.query.pagina) || 1;
    const limite = Number(req.query.limite) || 20;
    const { items, total } = await GcCredencial.listarPorBoveda(
      id_boveda,
      pagina,
      limite
    );
    res.json({ ok: true, items, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al listar credenciales" });
  }
};

const buscarPorUrl = async (req, res = response) => {
  try {
    const id_boveda = parseInt(req.params.id_boveda, 10);
    const uid = req.uid;
    const rolEnBoveda = await obtenerRolEnBoveda(id_boveda, uid);
    if (!rolEnBoveda)
      return res.status(403).json({ ok: false, msg: "Sin acceso a la bóveda" });
    const q = String(req.query.q || "");
    const pagina = Number(req.query.pagina) || 1;
    const limite = Number(req.query.limite) || 20;
    const { items, total } = await GcCredencial.buscarPorUrl(
      id_boveda,
      q,
      pagina,
      limite
    );
    res.json({ ok: true, items, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al buscar por URL" });
  }
};

const obtener = async (req, res = response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const uid = req.uid;
    const okLectura = await tieneLecturaCredencial(id, uid);
    if (!okLectura)
      return res
        .status(403)
        .json({ ok: false, msg: "Sin permiso para ver la credencial" });
    const credencial = await GcCredencial.obtenerPorId(id);
    if (!credencial)
      return res.status(404).json({ ok: false, msg: "No encontrada" });
    res.json({ ok: true, credencial });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al obtener credencial" });
  }
};

const crear = async (req, res = response) => {
  try {
    const body = req.body;
    const uid = req.uid;
    const rolEnBoveda = await obtenerRolEnBoveda(body.id_boveda, uid);
    if (
      !(
        rolEnBoveda === "DUENO" ||
        rolEnBoveda === "ADMIN" ||
        rolEnBoveda === "EDITOR"
      )
    )
      return res
        .status(403)
        .json({ ok: false, msg: "Sin permiso para crear en la bóveda" });
    const result = await GcCredencial.crear(body);
    const credencial = await GcCredencial.obtenerPorId(result.insertId);
    res.status(201).json({ ok: true, credencial });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al crear credencial" });
  }
};

const actualizar = async (req, res = response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const uid = req.uid;
    const okEscritura = await tieneEscrituraCredencial(id, uid);
    if (!okEscritura)
      return res
        .status(403)
        .json({ ok: false, msg: "Sin permiso para actualizar la credencial" });
    await GcCredencial.actualizar(id, req.body);
    const credencial = await GcCredencial.obtenerPorId(id);
    res.json({ ok: true, credencial });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al actualizar credencial" });
  }
};

const eliminar = async (req, res = response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const uid = req.uid;
    const okEscritura = await tieneEscrituraCredencial(id, uid);
    if (!okEscritura)
      return res
        .status(403)
        .json({ ok: false, msg: "Sin permiso para eliminar la credencial" });
    await GcCredencial.eliminar(id);
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al eliminar credencial" });
  }
};

// Etiquetas
const listarEtiquetas = async (req, res = response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const uid = req.uid;
    const okLectura = await tieneLecturaCredencial(id, uid);
    if (!okLectura)
      return res.status(403).json({ ok: false, msg: "Sin permiso" });
    const etiquetas = await GcCredencial.listarEtiquetas(id);
    res.json({ ok: true, etiquetas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al listar etiquetas" });
  }
};

const asignarEtiqueta = async (req, res = response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const uid = req.uid;
    const okEscritura = await tieneEscrituraCredencial(id, uid);
    if (!okEscritura)
      return res.status(403).json({ ok: false, msg: "Sin permiso" });
    const { id_etiqueta } = req.body;
    await GcCredencial.asignarEtiqueta(id, id_etiqueta);
    const etiquetas = await GcCredencial.listarEtiquetas(id);
    res.status(201).json({ ok: true, etiquetas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al asignar etiqueta" });
  }
};

const quitarEtiqueta = async (req, res = response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const uid = req.uid;
    const okEscritura = await tieneEscrituraCredencial(id, uid);
    if (!okEscritura)
      return res.status(403).json({ ok: false, msg: "Sin permiso" });
    const id_etiqueta = parseInt(req.params.id_etiqueta, 10);
    await GcCredencial.quitarEtiqueta(id, id_etiqueta);
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al quitar etiqueta" });
  }
};

// Carpetas
const listarCarpetas = async (req, res = response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const uid = req.uid;
    const okLectura = await tieneLecturaCredencial(id, uid);
    if (!okLectura)
      return res.status(403).json({ ok: false, msg: "Sin permiso" });
    const carpetas = await GcCredencial.listarCarpetas(id);
    res.json({ ok: true, carpetas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al listar carpetas" });
  }
};

const asignarCarpeta = async (req, res = response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const uid = req.uid;
    const okEscritura = await tieneEscrituraCredencial(id, uid);
    if (!okEscritura)
      return res.status(403).json({ ok: false, msg: "Sin permiso" });
    const { id_carpeta } = req.body;
    await GcCredencial.asignarCarpeta(id, id_carpeta);
    const carpetas = await GcCredencial.listarCarpetas(id);
    res.status(201).json({ ok: true, carpetas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al asignar carpeta" });
  }
};

const quitarCarpeta = async (req, res = response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const uid = req.uid;
    const okEscritura = await tieneEscrituraCredencial(id, uid);
    if (!okEscritura)
      return res.status(403).json({ ok: false, msg: "Sin permiso" });
    const id_carpeta = parseInt(req.params.id_carpeta, 10);
    await GcCredencial.quitarCarpeta(id, id_carpeta);
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al quitar carpeta" });
  }
};

// Compartidas
const listarCompartidas = async (req, res = response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const uid = req.uid;
    const okLectura = await tieneLecturaCredencial(id, uid);
    if (!okLectura)
      return res.status(403).json({ ok: false, msg: "Sin permiso" });
    const compartidas = await GcCredencial.listarCompartidos(id);
    res.json({ ok: true, compartidas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al listar comparticiones" });
  }
};

const compartir = async (req, res = response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const uid = req.uid;
    // Solo DUENO o ADMIN puede compartir
    const cred = await GcCredencial.obtenerPorId(id);
    if (!cred) return res.status(404).json({ ok: false, msg: "No encontrada" });
    const rolEnBoveda = await obtenerRolEnBoveda(cred.id_boveda, uid);
    if (!(rolEnBoveda === "DUENO" || rolEnBoveda === "ADMIN"))
      return res
        .status(403)
        .json({ ok: false, msg: "Sin permiso para compartir" });
    const { id_usuario, rol } = req.body;
    await GcCredencial.compartir(id, id_usuario, rol || "LECTOR");
    const compartidas = await GcCredencial.listarCompartidos(id);
    res.status(201).json({ ok: true, compartidas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al compartir credencial" });
  }
};

const revocarCompartida = async (req, res = response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const uid = req.uid;
    // Solo DUENO o ADMIN puede revocar
    const cred = await GcCredencial.obtenerPorId(id);
    if (!cred) return res.status(404).json({ ok: false, msg: "No encontrada" });
    const rolEnBoveda = await obtenerRolEnBoveda(cred.id_boveda, uid);
    if (!(rolEnBoveda === "DUENO" || rolEnBoveda === "ADMIN"))
      return res
        .status(403)
        .json({ ok: false, msg: "Sin permiso para revocar" });
    const id_usuario = parseInt(req.params.id_usuario, 10);
    await GcCredencial.revocarComparticion(id, id_usuario);
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al revocar compartición" });
  }
};

// Adjuntos
const listarAdjuntos = async (req, res = response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const uid = req.uid;
    const okLectura = await tieneLecturaCredencial(id, uid);
    if (!okLectura)
      return res.status(403).json({ ok: false, msg: "Sin permiso" });
    const adjuntos = await GcCredencial.listarAdjuntos(id);
    res.json({ ok: true, adjuntos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al listar adjuntos" });
  }
};

const agregarAdjunto = async (req, res = response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const uid = req.uid;
    const okEscritura = await tieneEscrituraCredencial(id, uid);
    if (!okEscritura)
      return res.status(403).json({ ok: false, msg: "Sin permiso" });
    const {
      nombre_archivo,
      mime_type,
      contenido_base64,
      iv_base64,
      tamano_bytes,
    } = req.body;
    // Convertir base64 a Buffer para almacenar en LONGBLOB
    const contenido_enc = Buffer.from(contenido_base64, "base64");
    const iv_contenido = Buffer.from(iv_base64, "base64");
    const result = await GcCredencial.agregarAdjunto({
      id_credencial: id,
      nombre_archivo,
      mime_type,
      contenido_enc,
      iv_contenido,
      tamano_bytes,
    });
    const adjuntoId = result.insertId;
    const adjunto = await GcCredencial.obtenerAdjunto(adjuntoId);
    res.status(201).json({ ok: true, adjunto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al agregar adjunto" });
  }
};

const obtenerAdjunto = async (req, res = response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const uid = req.uid;
    const okLectura = await tieneLecturaCredencial(id, uid);
    if (!okLectura)
      return res.status(403).json({ ok: false, msg: "Sin permiso" });
    const id_adjunto = parseInt(req.params.id_adjunto, 10);
    const adjunto = await GcCredencial.obtenerAdjunto(id_adjunto);
    if (!adjunto)
      return res.status(404).json({ ok: false, msg: "Adjunto no encontrado" });
    res.json({ ok: true, adjunto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al obtener adjunto" });
  }
};

const eliminarAdjunto = async (req, res = response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const uid = req.uid;
    const okEscritura = await tieneEscrituraCredencial(id, uid);
    if (!okEscritura)
      return res.status(403).json({ ok: false, msg: "Sin permiso" });
    const id_adjunto = parseInt(req.params.id_adjunto, 10);
    await GcCredencial.eliminarAdjunto(id_adjunto);
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al eliminar adjunto" });
  }
};

// Historial
const listarHistorial = async (req, res = response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const uid = req.uid;
    const okLectura = await tieneLecturaCredencial(id, uid);
    if (!okLectura)
      return res.status(403).json({ ok: false, msg: "Sin permiso" });
    const pagina = Number(req.query.pagina) || 1;
    const limite = Number(req.query.limite) || 50;
    const { items, total } = await GcCredencial.listarHistorial(
      id,
      pagina,
      limite
    );
    res.json({ ok: true, items, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al listar historial" });
  }
};

module.exports = {
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
};
