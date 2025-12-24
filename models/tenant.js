const db = require("../database/config");

class Tenant {
  static async listar(pagina = 1, limite = 10) {
    const offset = (pagina - 1) * limite;
    const [rows] = await db.query(
      "SELECT * FROM tenants ORDER BY fecha_creacion DESC LIMIT ? OFFSET ?",
      [limite, offset]
    );
    return rows;
  }

  static async contar() {
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM tenants");
    return rows[0].total;
  }

  static async obtenerPorId(id) {
    const [rows] = await db.query("SELECT * FROM tenants WHERE id_tenant = ?", [
      id,
    ]);
    return rows[0] || null;
  }

  static async crear(data) {
    const campos = ["nombre", "slug", "estado", "metadatos"];
    const cols = campos.filter((c) => data[c] !== undefined);
    const vals = cols.map((c) => data[c]);
    const placeholders = cols.map(() => "?").join(", ");
    const [result] = await db.query(
      `INSERT INTO tenants (${cols.join(", ")}) VALUES (${placeholders})`,
      vals
    );
    return result;
  }

  static async actualizar(id, data) {
    const campos = ["nombre", "slug", "estado", "metadatos"];
    const cols = campos.filter((c) => data[c] !== undefined);
    const sets = cols.map((c) => `${c} = ?`).join(", ");
    const vals = cols.map((c) => data[c]);
    vals.push(id);
    const [result] = await db.query(
      `UPDATE tenants SET ${sets} WHERE id_tenant = ?`,
      vals
    );
    return result;
  }

  static async eliminar(id) {
    const [result] = await db.query("DELETE FROM tenants WHERE id_tenant = ?", [
      id,
    ]);
    return result;
  }
}

module.exports = Tenant;
