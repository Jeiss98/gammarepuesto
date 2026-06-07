const { getDb } = require('../config/database');

function getAll() {
    return getDb().prepare(`
    SELECT * FROM categorias ORDER BY orden ASC
  `).all();
}

function getById(id) {
    return getDb().prepare('SELECT * FROM categorias WHERE id = ?').get(id);
}

function getBySlug(slug) {
    return getDb().prepare('SELECT * FROM categorias WHERE slug = ?').get(slug);
}

function create(data) {
    const db = getDb();
    const result = db.prepare(`
    INSERT INTO categorias (nombre, slug, icono, activo, orden)
    VALUES (@nombre, @slug, @icono, @activo, @orden)
  `).run(data);
    return getById(result.lastInsertRowid);
}

function update(id, data) {
    const fields = Object.keys(data).map(k => `${k} = @${k}`).join(', ');
    getDb().prepare(`UPDATE categorias SET ${fields}, updated_at = datetime('now') WHERE id = @id`)
        .run({ ...data, id });
    return getById(id);
}

function remove(id) {
    return getDb().prepare('DELETE FROM categorias WHERE id = ?').run(id);
}

module.exports = { getAll, getById, getBySlug, create, update, remove };