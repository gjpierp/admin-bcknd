require("dotenv").config();
const mysql = require("mysql2/promise");

(async () => {
  const sqlFn = `CREATE FUNCTION fn_mensaje_traducido(
    p_clave VARCHAR(100),
    p_codigo_idioma VARCHAR(5)
  )
  RETURNS TEXT
  DETERMINISTIC
  READS SQL DATA
  BEGIN
    DECLARE v_texto TEXT;
    DECLARE v_id_idioma INT;

    SELECT id_idioma INTO v_id_idioma 
    FROM idiomas 
    WHERE codigo_iso = p_codigo_idioma AND activo = TRUE
    LIMIT 1;

    IF v_id_idioma IS NULL THEN
        SELECT id_idioma INTO v_id_idioma 
        FROM idiomas 
        WHERE por_defecto = TRUE
        LIMIT 1;
    END IF;

    SELECT tmv.texto INTO v_texto
    FROM traducciones_mensajes tm
    INNER JOIN traducciones_mensajes_valores tmv ON tm.id_mensaje = tmv.id_mensaje
    WHERE tm.clave = p_clave
      AND tmv.id_idioma = v_id_idioma
    LIMIT 1;

    RETURN COALESCE(v_texto, p_clave);
  END`;

  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true,
    });

    await conn.query("DROP FUNCTION IF EXISTS fn_mensaje_traducido");
    await conn.query(sqlFn);
    console.log("✓ Función fn_mensaje_traducido creada correctamente");
  } catch (err) {
    console.error("✗ Error creando función:", err.message);
    process.exitCode = 1;
  } finally {
    if (conn) await conn.end();
  }
})();
