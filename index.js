require("dotenv").config();
const path = require("path");

const express = require("express");
const cors = require("cors");

const dbConnection = require("./database/config");
const {
  sanitizarInputs,
  validarTamanoBody,
} = require("./middlewares/validar-inputs");
const {
  manejadorErrores,
  rutaNoEncontrada,
} = require("./middlewares/manejador-errores");
const { capturarIdioma } = require("./middlewares/gestionar-idioma");

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use(cors());

// Protección contra payloads muy grandes
app.use(validarTamanoBody(2048)); // 2MB máximo

// Lectura y parseo del body con captura de raw para depuración
app.use(
  express.json({
    verify: (req, res, buf) => {
      try {
        req.rawBody = buf ? buf.toString() : undefined;
      } catch (_) {
        req.rawBody = undefined;
      }
    },
  })
);
// Soporte para application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Sanitizar inputs
app.use(sanitizarInputs);

// Capturar idioma del request
app.use(capturarIdioma);

// Base de datos
// La conexión ya se establece al importar el módulo

// Directorio público
app.use(express.static("public"));

// Rutas
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/roles", require("./routes/roles"));
app.use("/api/permisos", require("./routes/permisos"));
app.use("/api/menus", require("./routes/menus"));
app.use("/api/todo", require("./routes/busquedas"));
app.use("/api/login", require("./routes/auth"));
app.use("/api/upload", require("./routes/uploads"));
app.use("/api/territorios", require("./routes/territorios"));
app.use("/api/traducciones", require("./routes/traducciones"));
app.use("/api/tenants", require("./routes/tenants"));
app.use("/api/entornos", require("./routes/entornos"));
app.use("/api/aplicaciones", require("./routes/aplicaciones"));
app.use("/api/sitios", require("./routes/sitios"));
app.use("/api/dominios", require("./routes/dominios"));
app.use("/api/paginas", require("./routes/paginas"));
app.use("/api/rutas", require("./routes/rutas"));

// Gestor de contraseñas (sin prefijo gc)
app.use("/api/bovedas", require("./routes/bovedas"));
app.use("/api/credenciales", require("./routes/credenciales"));

// Ruta catch-all para SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Manejador de rutas no encontradas (debe ir después de todas las rutas)
app.use(rutaNoEncontrada);

// Manejador global de errores (debe ser el último middleware)
app.use(manejadorErrores);

app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en puerto " + process.env.PORT);
});
