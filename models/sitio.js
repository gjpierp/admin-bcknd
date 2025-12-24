const db = require("../database/config");

class Sitio {
  static async listar(pagina = 1, limite = 10, filtro = {}) {
    const offset = (pagina - 1) * limite;
    const where = [];
    const params = [];
    if (filtro.id_app) {
      where.push("id_app = ?");
      params.push(filtro.id_app);
    }
    if (filtro.id_entorno) {
      where.push("id_entorno = ?");
      params.push(filtro.id_entorno);
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const [rows] = await db.query(
      `SELECT * FROM sitios_web ${whereSql} ORDER BY fecha_creacion DESC LIMIT ? OFFSET ?`,
      [...params, limite, offset]
    );
    return rows;
  }

  static async contar(filtro = {}) {
    const where = [];
    const params = [];
    if (filtro.id_app) {
      where.push("id_app = ?");
      params.push(filtro.id_app);
    }
    if (filtro.id_entorno) {
      where.push("id_entorno = ?");
      params.push(filtro.id_entorno);
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const [rows] = await db.query(
      `SELECT COUNT(*) AS total FROM sitios_web ${whereSql}`,
      params
    );
    return rows[0].total;
  }

  static async obtenerPorId(id) {
    const [rows] = await db.query(
      "SELECT * FROM sitios_web WHERE id_sitio = ?",
      [id]
    );
    return rows[0] || null;
  }

  static async crear(data) {
    const campos = [
      "id_app",
      "id_entorno",
      "nombre",
      "slug",
      "base_url",
      "id_idioma_por_defecto",
      "timezone",
      "estado",
      "tema",
      "metadatos",
    ];
    const cols = campos.filter((c) => data[c] !== undefined);
    const vals = cols.map((c) => data[c]);
    const placeholders = cols.map(() => "?").join(", ");
    const [result] = await db.query(
      `INSERT INTO sitios_web (${cols.join(", ")}) VALUES (${placeholders})`,
      vals
    );
    return result;
  }

  static async actualizar(id, data) {
    const campos = [
      "id_app",
      "id_entorno",
      "nombre",
      "slug",
      "base_url",
      "id_idioma_por_defecto",
      "timezone",
      "estado",
      "tema",
      "metadatos",
    ];
    const cols = campos.filter((c) => data[c] !== undefined);
    const sets = cols.map((c) => `${c} = ?`).join(", ");
    const vals = cols.map((c) => data[c]);
    vals.push(id);
    const [result] = await db.query(
      `UPDATE sitios_web SET ${sets} WHERE id_sitio = ?`,
      vals
    );
    return result;
  }

  static async eliminar(id) {
    const [result] = await db.query(
      "DELETE FROM sitios_web WHERE id_sitio = ?",
      [id]
    );
    return result;
  }
}

module.exports = Sitio;
