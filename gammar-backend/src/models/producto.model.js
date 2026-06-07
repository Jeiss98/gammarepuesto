const { getDb } = require('../config/database');

function getAll({ soloActivos = false } = {}) {
    const where = soloActivos ? 'WHERE p.activo = 1 AND p.deleted_at IS NULL' : 'WHERE p.deleted_at IS NULL';
    return getDb().prepare(`
    SELECT p.*, c.nombre as categoria_nombre, c.slug as categoria_slug
    FROM productos p
    LEFT JOIN categorias c ON c.id = p.categoria_id
    ${where}
    ORDER BY p.created_at DESC
  `).all();
}

function getById(id) {
    return getDb().prepare(`
    SELECT p.*, c.nombre as categoria_nombre
    FROM productos p
    LEFT JOIN categorias c ON c.id = p.categoria_id
    WHERE p.id = ? AND p.deleted_at IS NULL
  `).get(id);
}

function getBySlug(slug) {
    const producto = getDb().prepare(`
    SELECT p.*, c.nombre as categoria_nombre
    FROM productos p
    LEFT JOIN categorias c ON c.id = p.categoria_id
    WHERE p.slug = ? AND p.deleted_at IS NULL
  `).get(slug);
    if (!producto) return null;
    producto.fotos = getDb().prepare('SELECT * FROM fotos WHERE producto_id = ? ORDER BY orden ASC').all(producto.id);
    return producto;
}

function create(data) {
    const result = getDb().prepare(`
    INSERT INTO productos (categoria_id, nombre, slug, descripcion, precio, marca, imagen, es_oferta, activo, stock)
    VALUES (@categoria_id, @nombre, @slug, @descripcion, @precio, @marca, @imagen, @es_oferta, @activo, @stock)
  `).run({ ...data, imagen: data.imagen || null });
    return getById(result.lastInsertRowid);
}

function update(id, data) {
    // Filter out undefined values to avoid sqlite errors
    const fields = Object.keys(data).filter(k => data[k] !== undefined).map(k => `${k} = @${k}`).join(', ');
    getDb().prepare(`UPDATE productos SET ${fields}, updated_at = datetime('now') WHERE id = @id`)
        .run({ ...data, id });
    return getById(id);
}

function remove(id) {
    return getDb().prepare(`UPDATE productos SET deleted_at = datetime('now') WHERE id = ?`).run(id);
}

module.exports = { getAll, getById, getBySlug, create, update, remove };