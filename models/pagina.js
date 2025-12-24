const db = require("../database/config");

class Pagina {
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
      `SELECT * FROM paginas ${whereSql} ORDER BY fecha_creacion DESC LIMIT ? OFFSET ?`,
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
      `SELECT COUNT(*) AS total FROM paginas ${whereSql}`,
      params
    );
    return rows[0].total;
  }

  static async obtenerPorId(id) {
    const [rows] = await db.query("SELECT * FROM paginas WHERE id_pagina = ?", [
      id,
    ]);
    return rows[0] || null;
  }

  static async crear(data) {
    const campos = [
      "id_sitio",
      "titulo",
      "slug",
      "estado",
      "plantilla",
      "contenido",
      "seo",
      "publicada_en",
    ];
    const cols = campos.filter((c) => data[c] !== undefined);
    const vals = cols.map((c) => data[c]);
    const placeholders = cols.map(() => "?").join(", ");
    const [result] = await db.query(
      `INSERT INTO paginas (${cols.join(", ")}) VALUES (${placeholders})`,
      vals
    );
    return result;
  }

  static async actualizar(id, data) {
    const campos = [
      "id_sitio",
      "titulo",
      "slug",
      "estado",
      "plantilla",
      "contenido",
      "seo",
      "publicada_en",
    ];
    const cols = campos.filter((c) => data[c] !== undefined);
    const sets = cols.map((c) => `${c} = ?`).join(", ");
    const vals = cols.map((c) => data[c]);
    vals.push(id);
    const [result] = await db.query(
      `UPDATE paginas SET ${sets} WHERE id_pagina = ?`,
      vals
    );
    return result;
  }

  static async eliminar(id) {
    const [result] = await db.query("DELETE FROM paginas WHERE id_pagina = ?", [
      id,
    ]);
    return result;
  }
}

module.exports = Pagina;
