const { getDb } = require('../config/database');

function getAll() {
    return getDb().prepare('SELECT * FROM faqs ORDER BY orden ASC').all();
}

function getById(id) {
    return getDb().prepare('SELECT * FROM faqs WHERE id = ?').get(id);
}

function create(data) {
    const r = getDb().prepare('INSERT INTO faqs (pregunta, respuesta, orden, activo) VALUES (?, ?, ?, ?)')
        .run(data.pregunta, data.respuesta, data.orden || 0, data.activo !== undefined ? data.activo : 1);
    return getById(r.lastInsertRowid);
}

function update(id, data) {
    const db = getDb();
    const current = getById(id);
    if (!current) return null;
    db.prepare('UPDATE faqs SET pregunta = ?, respuesta = ?, orden = ?, activo = ?, updated_at = datetime("now") WHERE id = ?')
        .run(
            data.pregunta || current.pregunta,
            data.respuesta || current.respuesta,
            data.orden !== undefined ? data.orden : current.orden,
            data.activo !== undefined ? data.activo : current.activo,
            id
        );
    return getById(id);
}

function remove(id) {
    return getDb().prepare('DELETE FROM faqs WHERE id = ?').run(id);
}

module.exports = { getAll, getById, create, update, remove };
