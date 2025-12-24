const db = require("../database/config");

class Aplicacion {
  static async listar(pagina = 1, limite = 10, filtro = {}) {
    const offset = (pagina - 1) * limite;
    const where = [];
    const params = [];
    if (filtro.id_tenant) {
      where.push("id_tenant = ?");
      params.push(filtro.id_tenant);
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const [rows] = await db.query(
      `SELECT * FROM aplicaciones ${whereSql} ORDER BY fecha_creacion DESC LIMIT ? OFFSET ?`,
      [...params, limite, offset]
    );
    return rows;
  }

  static async contar(filtro = {}) {
    const where = [];
    const params = [];
    if (filtro.id_tenant) {
      where.push("id_tenant = ?");
      params.push(filtro.id_tenant);
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const [rows] = await db.query(
      `SELECT COUNT(*) AS total FROM aplicaciones ${whereSql}`,
      params
    );
    return rows[0].total;
  }

  static async obtenerPorId(id) {
    const [rows] = await db.query(
      "SELECT * FROM aplicaciones WHERE id_app = ?",
      [id]
    );
    return rows[0] || null;
  }

  static async crear(data) {
    const campos = [
      "id_tenant",
      "nombre",
      "tipo",
      "repo_url",
      "estado",
      "metadatos",
    ];
    const cols = campos.filter((c) => data[c] !== undefined);
    const vals = cols.map((c) => data[c]);
    const placeholders = cols.map(() => "?").join(", ");
    const [result] = await db.query(
      `INSERT INTO aplicaciones (${cols.join(", ")}) VALUES (${placeholders})`,
      vals
    );
    return result;
  }

  static async actualizar(id, data) {
    const campos = [
      "id_tenant",
      "nombre",
      "tipo",
      "repo_url",
      "estado",
      "metadatos",
    ];
    const cols = campos.filter((c) => data[c] !== undefined);
    const sets = cols.map((c) => `${c} = ?`).join(", ");
    const vals = cols.map((c) => data[c]);
    vals.push(id);
    const [result] = await db.query(
      `UPDATE aplicaciones SET ${sets} WHERE id_app = ?`,
      vals
    );
    return result;
  }

  static async eliminar(id) {
    const [result] = await db.query(
      "DELETE FROM aplicaciones WHERE id_app = ?",
      [id]
    );
    return result;
  }
}

module.exports = Aplicacion;
