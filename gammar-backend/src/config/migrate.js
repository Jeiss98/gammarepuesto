require('dotenv').config();
const { getDb } = require('./database');

const db = getDb();

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    password   TEXT    NOT NULL,
    role       TEXT    NOT NULL DEFAULT 'admin',
    created_at TEXT    DEFAULT (datetime('now')),
    updated_at TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS categorias (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre     TEXT    NOT NULL,
    slug       TEXT    NOT NULL UNIQUE,
    icono      TEXT,
    activo     INTEGER NOT NULL DEFAULT 1,
    orden      INTEGER NOT NULL DEFAULT 0,
    created_at TEXT    DEFAULT (datetime('now')),
    updated_at TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS productos (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
    nombre       TEXT    NOT NULL,
    slug         TEXT    NOT NULL UNIQUE,
    descripcion  TEXT,
    precio       REAL    NOT NULL DEFAULT 0,
    marca        TEXT,
    imagen       TEXT,
    es_oferta    INTEGER NOT NULL DEFAULT 0,
    activo       INTEGER NOT NULL DEFAULT 1,
    stock        INTEGER NOT NULL DEFAULT 0,
    deleted_at   TEXT,
    created_at   TEXT    DEFAULT (datetime('now')),
    updated_at   TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS servicios (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre      TEXT    NOT NULL,
    descripcion TEXT    NOT NULL,
    icono       TEXT,
    activo      INTEGER NOT NULL DEFAULT 1,
    orden       INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    DEFAULT (datetime('now')),
    updated_at  TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS fotos (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    ruta            TEXT    NOT NULL,
    nombre_original TEXT    NOT NULL,
    tipo            TEXT    NOT NULL DEFAULT 'galeria',
    producto_id     INTEGER REFERENCES productos(id) ON DELETE CASCADE,
    orden           INTEGER NOT NULL DEFAULT 0,
    created_at      TEXT    DEFAULT (datetime('now')),
    updated_at      TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS info_negocios (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre             TEXT    NOT NULL,
    whatsapp           TEXT    NOT NULL,
    telefono           TEXT,
    email              TEXT,
    direccion          TEXT,
    horario_inicio_dia TEXT,
    horario_fin_dia    TEXT,
    hora_apertura      TEXT,
    hora_cierre        TEXT,
    descripcion_hero   TEXT,
    mensaje_wa_default TEXT,
    created_at         TEXT    DEFAULT (datetime('now')),
    updated_at         TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS pedidos (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_nombre   TEXT,
    cliente_telefono TEXT,
    productos_json   TEXT    NOT NULL,
    total_estimado   REAL    NOT NULL DEFAULT 0,
    mensaje_wa       TEXT    NOT NULL,
    estado           TEXT    NOT NULL DEFAULT 'enviado',
    created_at       TEXT    DEFAULT (datetime('now')),
    updated_at       TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS faqs (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    pregunta   TEXT    NOT NULL,
    respuesta  TEXT    NOT NULL,
    orden      INTEGER NOT NULL DEFAULT 0,
    activo     INTEGER NOT NULL DEFAULT 1,
    created_at TEXT    DEFAULT (datetime('now')),
    updated_at TEXT    DEFAULT (datetime('now'))
  );
`);

try {
  db.exec(`ALTER TABLE info_negocios ADD COLUMN nosotros_historia TEXT`);
} catch (e) { /* Columna ya existe */ }

try {
  db.exec(`ALTER TABLE info_negocios ADD COLUMN nosotros_filosofia TEXT`);
} catch (e) { /* Columna ya existe */ }

console.log('✅ Tablas creadas correctamente');