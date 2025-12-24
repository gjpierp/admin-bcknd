const db = require("../database/config");

class Ruta {
  static async listar(pagina = 1, limite = 10, filtro = {}) {
    const offset = (pagina - 1) * limite;
    const where = [];
    const params = [];
    if (filtro.id_sitio) {
      where.push("id_sitio = ?");
      params.push(filtro.id_sitio);
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const [rows] = await db.query(
      `SELECT * FROM rutas ${whereSql} ORDER BY fecha_creacion DESC LIMIT ? OFFSET ?`,
      [...params, limite, offset]
    );
    return rows;
  }

  static async contar(filtro = {}) {
    const where = [];
    const params = [];
    if (filtro.id_sitio) {
      where.push("id_sitio = ?");
      params.push(filtro.id_sitio);
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const [rows] = await db.query(
      `SELECT COUNT(*) AS total FROM rutas ${whereSql}`,
      params
    );
    return rows[0].total;
  }

  static async obtenerPorId(id) {
    const [rows] = await db.query("SELECT * FROM rutas WHERE id_ruta = ?", [
      id,
    ]);
    return rows[0] || null;
  }

  static async crear(data) {
    const campos = [
      "id_sitio",
      "metodo",
      "path",
      "tipo",
      "id_pagina",
      "destino",
      "codigo_redirect",
      "activo",
    ];
    const cols = campos.filter((c) => data[c] !== undefined);
    const vals = cols.map((c) => data[c]);
    const placeholders = cols.map(() => "?").join(", ");
    const [result] = await db.query(
      `INSERT INTO rutas (${cols.join(", ")}) VALUES (${placeholders})`,
      vals
    );
    return result;
  }

  static async actualizar(id, data) {
    const campos = [
      "id_sitio",
      "metodo",
      "path",
      "tipo",
      "id_pagina",
      "destino",
      "codigo_redirect",
      "activo",
    ];
    const cols = campos.filter((c) => data[c] !== undefined);
    const sets = cols.map((c) => `${c} = ?`).join(", ");
    const vals = cols.map((c) => data[c]);
    vals.push(id);
    const [result] = await db.query(
      `UPDATE rutas SET ${sets} WHERE id_ruta = ?`,
      vals
    );
    return result;
  }

  static async eliminar(id) {
    const [result] = await db.query("DELETE FROM rutas WHERE id_ruta = ?", [
      id,
    ]);
    return result;
  }
}

module.exports = Ruta;
