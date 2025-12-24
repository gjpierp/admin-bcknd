const db = require("../database/config");

class GcCredencial {
  static async crear({
    id_boveda,
    titulo,
    usuario_cuenta,
    url,
    contrasena_enc,
    iv_contrasena,
    notas_enc,
    iv_notas,
    totp_secreto_enc,
    iv_totp,
    puntaje_seguridad,
    estado_brecha,
    fecha_expiracion,
  }) {
    const sql = `INSERT INTO gc_credenciales (id_boveda, titulo, usuario_cuenta, url, contrasena_enc, iv_contrasena, notas_enc, iv_notas, totp_secreto_enc, iv_totp, puntaje_seguridad, estado_brecha, fecha_expiracion)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [
      id_boveda,
      titulo,
      usuario_cuenta || null,
      url || null,
      contrasena_enc,
      iv_contrasena,
      notas_enc || null,
      iv_notas || null,
      totp_secreto_enc || null,
      iv_totp || null,
      puntaje_seguridad || null,
      estado_brecha || "NINGUNA",
      fecha_expiracion || null,
    ]);
    return result;
  }

  static async actualizar(id_credencial, datos) {
    const sql = `UPDATE gc_credenciales SET
      id_boveda = COALESCE(?, id_boveda),
      titulo = COALESCE(?, titulo),
      usuario_cuenta = COALESCE(?, usuario_cuenta),
      url = COALESCE(?, url),
      contrasena_enc = COALESCE(?, contrasena_enc),
      iv_contrasena = COALESCE(?, iv_contrasena),
      notas_enc = COALESCE(?, notas_enc),
      iv_notas = COALESCE(?, iv_notas),
      totp_secreto_enc = COALESCE(?, totp_secreto_enc),
      iv_totp = COALESCE(?, iv_totp),
      puntaje_seguridad = COALESCE(?, puntaje_seguridad),
      estado_brecha = COALESCE(?, estado_brecha),
      fecha_expiracion = COALESCE(?, fecha_expiracion)
    WHERE id_credencial = ?`;
    const params = [
      datos.id_boveda || null,
      datos.titulo || null,
      datos.usuario_cuenta || null,
      datos.url || null,
      datos.contrasena_enc || null,
      datos.iv_contrasena || null,
      datos.notas_enc || null,
      datos.iv_notas || null,
      datos.totp_secreto_enc || null,
      datos.iv_totp || null,
      datos.puntaje_seguridad || null,
      datos.estado_brecha || null,
      datos.fecha_expiracion || null,
      id_credencial,
    ];
    const [result] = await db.query(sql, params);
    return result;
  }

  static async eliminar(id_credencial) {
    const [result] = await db.query(
      `DELETE FROM gc_credenciales WHERE id_credencial = ?`,
      [id_credencial]
    );
    return result;
  }

  static async obtenerPorId(id_credencial) {
    const [rows] = await db.query(
      `SELECT * FROM gc_credenciales WHERE id_credencial = ?`,
      [id_credencial]
    );
    return rows[0] || null;
  }

  static async listarPorBoveda(id_boveda, pagina = 1, limite = 20) {
    const offset = (pagina - 1) * limite;
    const [rows] = await db.query(
      `SELECT * FROM gc_credenciales WHERE id_boveda = ? ORDER BY titulo LIMIT ? OFFSET ?`,
      [id_boveda, limite, offset]
    );
    const [countRows] = await db.query(
      `SELECT COUNT(*) as total FROM gc_credenciales WHERE id_boveda = ?`,
      [id_boveda]
    );
    return { items: rows, total: countRows[0].total };
  }

  static async buscarPorUrl(id_boveda, termino, pagina = 1, limite = 20) {
    const offset = (pagina - 1) * limite;
    const like = `%${termino}%`;
    const [rows] = await db.query(
      `SELECT * FROM gc_credenciales WHERE id_boveda = ? AND url LIKE ? ORDER BY titulo LIMIT ? OFFSET ?`,
      [id_boveda, like, limite, offset]
    );
    const [countRows] = await db.query(
      `SELECT COUNT(*) as total FROM gc_credenciales WHERE id_boveda = ? AND url LIKE ?`,
      [id_boveda, like]
    );
    return { items: rows, total: countRows[0].total };
  }

  // Etiquetas
  static async asignarEtiqueta(id_credencial, id_etiqueta) {
    const [result] = await db.query(
      `INSERT INTO gc_credencial_etiqueta (id_credencial, id_etiqueta) VALUES (?, ?) ON DUPLICATE KEY UPDATE id_credencial = VALUES(id_credencial)`,
      [id_credencial, id_etiqueta]
    );
    return result;
  }
  static async quitarEtiqueta(id_credencial, id_etiqueta) {
    const [result] = await db.query(
      `DELETE FROM gc_credencial_etiqueta WHERE id_credencial = ? AND id_etiqueta = ?`,
      [id_credencial, id_etiqueta]
    );
    return result;
  }
  static async listarEtiquetas(id_credencial) {
    const [rows] = await db.query(
      `SELECT e.* FROM gc_etiquetas e INNER JOIN gc_credencial_etiqueta ce ON ce.id_etiqueta = e.id_etiqueta WHERE ce.id_credencial = ? ORDER BY e.nombre`,
      [id_credencial]
    );
    return rows;
  }

  // Carpetas
  static async asignarCarpeta(id_credencial, id_carpeta) {
    const [result] = await db.query(
      `INSERT INTO gc_credencial_carpeta (id_credencial, id_carpeta) VALUES (?, ?) ON DUPLICATE KEY UPDATE id_credencial = VALUES(id_credencial)`,
      [id_credencial, id_carpeta]
    );
    return result;
  }
  static async quitarCarpeta(id_credencial, id_carpeta) {
    const [result] = await db.query(
      `DELETE FROM gc_credencial_carpeta WHERE id_credencial = ? AND id_carpeta = ?`,
      [id_credencial, id_carpeta]
    );
    return result;
  }
  static async listarCarpetas(id_credencial) {
    const [rows] = await db.query(
      `SELECT c.* FROM gc_carpetas c INNER JOIN gc_credencial_carpeta cc ON cc.id_carpeta = c.id_carpeta WHERE cc.id_credencial = ? ORDER BY c.nombre`,
      [id_credencial]
    );
    return rows;
  }

  // Comparticiones
  static async compartir(id_credencial, id_usuario, rol = "LECTOR") {
    const [result] = await db.query(
      `INSERT INTO gc_credencial_compartida (id_credencial, id_usuario, rol, estado) VALUES (?, ?, ?, 'ACTIVA') ON DUPLICATE KEY UPDATE rol = VALUES(rol), estado = 'ACTIVA'`,
      [id_credencial, id_usuario, rol]
    );
    return result;
  }
  static async revocarComparticion(id_credencial, id_usuario) {
    const [result] = await db.query(
      `UPDATE gc_credencial_compartida SET estado = 'REVOCADA' WHERE id_credencial = ? AND id_usuario = ?`,
      [id_credencial, id_usuario]
    );
    return result;
  }
  static async listarCompartidos(id_credencial) {
    const [rows] = await db.query(
      `SELECT cc.*, u.nombre_usuario, u.correo_electronico FROM gc_credencial_compartida cc INNER JOIN usuarios u ON u.id_usuario = cc.id_usuario WHERE cc.id_credencial = ? ORDER BY u.nombre_usuario`,
      [id_credencial]
    );
    return rows;
  }

  // Adjuntos
  static async agregarAdjunto({
    id_credencial,
    nombre_archivo,
    mime_type,
    contenido_enc,
    iv_contenido,
    tamano_bytes,
  }) {
    const sql = `INSERT INTO gc_adjuntos_credencial (id_credencial, nombre_archivo, mime_type, contenido_enc, iv_contenido, tamano_bytes) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [
      id_credencial,
      nombre_archivo,
      mime_type || null,
      contenido_enc,
      iv_contenido,
      tamano_bytes || null,
    ]);
    return result;
  }
  static async listarAdjuntos(id_credencial) {
    const [rows] = await db.query(
      `SELECT id_adjunto, nombre_archivo, mime_type, tamano_bytes, fecha_creacion FROM gc_adjuntos_credencial WHERE id_credencial = ? ORDER BY fecha_creacion DESC`,
      [id_credencial]
    );
    return rows;
  }
  static async obtenerAdjunto(id_adjunto) {
    const [rows] = await db.query(
      `SELECT * FROM gc_adjuntos_credencial WHERE id_adjunto = ?`,
      [id_adjunto]
    );
    return rows[0] || null;
  }
  static async eliminarAdjunto(id_adjunto) {
    const [result] = await db.query(
      `DELETE FROM gc_adjuntos_credencial WHERE id_adjunto = ?`,
      [id_adjunto]
    );
    return result;
  }

  // Historial (solo lectura, inserción junto a rotación si se desea)
  static async listarHistorial(id_credencial, pagina = 1, limite = 50) {
    const offset = (pagina - 1) * limite;
    const [rows] = await db.query(
      `SELECT * FROM gc_historial_contrasenas_item WHERE id_credencial = ? ORDER BY fecha_rotacion DESC LIMIT ? OFFSET ?`,
      [id_credencial, limite, offset]
    );
    const [countRows] = await db.query(
      `SELECT COUNT(*) as total FROM gc_historial_contrasenas_item WHERE id_credencial = ?`,
      [id_credencial]
    );
    return { items: rows, total: countRows[0].total };
  }
}

module.exports = GcCredencial;
