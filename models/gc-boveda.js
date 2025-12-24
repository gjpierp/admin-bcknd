const db = require("../database/config");

class GcBoveda {
  static async crear({
    id_usuario_dueno,
    nombre,
    tipo,
    clave_boveda_enc,
    iv_boveda,
  }) {
    const sql = `INSERT INTO gc_bovedas (id_usuario_dueno, nombre, tipo, clave_boveda_enc, iv_boveda) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [
      id_usuario_dueno || null,
      nombre,
      tipo || "PERSONAL",
      clave_boveda_enc || null,
      iv_boveda || null,
    ]);
    return result;
  }

  static async actualizar(
    id_boveda,
    { nombre, tipo, clave_boveda_enc, iv_boveda }
  ) {
    const sql = `UPDATE gc_bovedas SET nombre = COALESCE(?, nombre), tipo = COALESCE(?, tipo), clave_boveda_enc = COALESCE(?, clave_boveda_enc), iv_boveda = COALESCE(?, iv_boveda) WHERE id_boveda = ?`;
    const [result] = await db.query(sql, [
      nombre || null,
      tipo || null,
      clave_boveda_enc || null,
      iv_boveda || null,
      id_boveda,
    ]);
    return result;
  }

  static async eliminar(id_boveda) {
    const sql = `DELETE FROM gc_bovedas WHERE id_boveda = ?`;
    const [result] = await db.query(sql, [id_boveda]);
    return result;
  }

  static async obtenerPorId(id_boveda) {
    const [rows] = await db.query(
      `SELECT * FROM gc_bovedas WHERE id_boveda = ?`,
      [id_boveda]
    );
    return rows[0] || null;
  }

  static async listarPorDueno(id_usuario_dueno) {
    const [rows] = await db.query(
      `SELECT * FROM gc_bovedas WHERE id_usuario_dueno = ? ORDER BY nombre`,
      [id_usuario_dueno]
    );
    return rows;
  }

  static async listarPorMiembro(id_usuario) {
    const [rows] = await db.query(
      `SELECT b.* FROM gc_bovedas b
       INNER JOIN gc_boveda_miembro bm ON bm.id_boveda = b.id_boveda
       WHERE bm.id_usuario = ? ORDER BY b.nombre`,
      [id_usuario]
    );
    return rows;
  }

  static async listarTodas() {
    const [rows] = await db.query(`SELECT * FROM gc_bovedas ORDER BY nombre`);
    return rows;
  }

  static async listarMiBovedas(id_usuario) {
    const [rows] = await db.query(
      `SELECT DISTINCT b.* FROM gc_bovedas b
       LEFT JOIN gc_boveda_miembro bm ON bm.id_boveda = b.id_boveda
       WHERE b.id_usuario_dueno = ? OR bm.id_usuario = ?
       ORDER BY b.nombre`,
      [id_usuario, id_usuario]
    );
    return rows;
  }

  // Miembros
  static async listarMiembros(id_boveda) {
    const [rows] = await db.query(
      `SELECT bm.*, u.nombre_usuario, u.correo_electronico FROM gc_boveda_miembro bm
       INNER JOIN usuarios u ON u.id_usuario = bm.id_usuario
       WHERE bm.id_boveda = ? ORDER BY u.nombre_usuario`,
      [id_boveda]
    );
    return rows;
  }

  static async agregarMiembro(id_boveda, id_usuario, rol) {
    const sql = `INSERT INTO gc_boveda_miembro (id_boveda, id_usuario, rol) VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE rol = VALUES(rol)`;
    const [result] = await db.query(sql, [id_boveda, id_usuario, rol]);
    return result;
  }

  static async eliminarMiembro(id_boveda, id_usuario) {
    const [result] = await db.query(
      `DELETE FROM gc_boveda_miembro WHERE id_boveda = ? AND id_usuario = ?`,
      [id_boveda, id_usuario]
    );
    return result;
  }
}

module.exports = GcBoveda;
