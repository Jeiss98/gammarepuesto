const { getDb } = require('../config/database');

function getAll() {
    return getDb().prepare('SELECT * FROM servicios ORDER BY orden ASC').all();
}

function getById(id) {
    return getDb().prepare('SELECT * FROM servicios WHERE id = ?').get(id);
}

function create(data) {
    const result = getDb().prepare(`
    INSERT INTO servicios (nombre, descripcion, icono, activo, orden)
    VALUES (@nombre, @descripcion, @icono, @activo, @orden)
  `).run(data);
    return getById(result.lastInsertRowid);
}

function update(id, data) {
    const fields = Object.keys(data).map(k => `${k} = @${k}`).join(', ');
    getDb().prepare(`UPDATE servicios SET ${fields}, updated_at = datetime('now') WHERE id = @id`)
        .run({ ...data, id });
    return getById(id);
}

function remove(id) {
    return getDb().prepare('DELETE FROM servicios WHERE id = ?').run(id);
}

module.exports = { getAll, getById, create, update, remove };