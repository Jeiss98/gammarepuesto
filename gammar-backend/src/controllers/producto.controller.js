const slugify = require('slugify');
const Producto = require('../models/producto.model');

// Si req.user existe → petición admin (middleware auth lo inyecta)
// Si no existe → petición pública → solo productos activos
function index(req, res) {
    const soloActivos = !req.user;
    res.json(Producto.getAll({ soloActivos }));
}

function show(req, res) {
    const producto = req.params.slug
        ? Producto.getBySlug(req.params.slug)
        : Producto.getById(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
}

function store(req, res) {
    const { categoria_id, nombre, descripcion, precio, marca, es_oferta = 0, activo = 1, stock = 0 } = req.body;
    if (!nombre || precio === undefined || precio === null) {
        return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }

    const slug = slugify(`${nombre}-${Date.now()}`, { lower: true, strict: true });
    let imagen = null;
    if (req.file) {
        imagen = `${process.env.API_URL || 'http://localhost:3000'}/uploads/${req.file.filename}`;
    }

    const producto = Producto.create({
        categoria_id: categoria_id || null,
        nombre, slug, descripcion,
        precio: Number(precio),
        marca, imagen,
        es_oferta: Number(es_oferta),
        activo: Number(activo),
        stock: Number(stock)
    });
    res.status(201).json(producto);
}

function update(req, res) {
    const producto = Producto.getById(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    const data = { ...req.body };

    // FormData envía todo como string → convertir tipos
    if (data.precio !== undefined) data.precio = Number(data.precio);
    if (data.stock !== undefined) data.stock = Number(data.stock);
    if (data.es_oferta !== undefined) data.es_oferta = Number(data.es_oferta);
    if (data.activo !== undefined) data.activo = Number(data.activo);
    if (data.categoria_id !== undefined) data.categoria_id = data.categoria_id ? Number(data.categoria_id) : null;

    if (data.nombre && data.nombre !== producto.nombre) {
        data.slug = slugify(`${data.nombre}-${Date.now()}`, { lower: true, strict: true });
    }
    if (req.file) {
        data.imagen = `${process.env.API_URL || 'http://localhost:3000'}/uploads/${req.file.filename}`;
    }

    res.json(Producto.update(req.params.id, data));
}

function destroy(req, res) {
    const producto = Producto.getById(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    Producto.remove(req.params.id);
    res.status(204).send();
}

function uploadFotos(req, res) {
    const producto = Producto.getById(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No se subieron imágenes' });
    }

    const { getDb } = require('../config/database');
    const db = getDb();

    // Obtener el orden máximo actual
    const maxOrdenRow = db.prepare('SELECT MAX(orden) as maxOrden FROM fotos WHERE producto_id = ?').get(producto.id);
    let orden = (maxOrdenRow.maxOrden || 0) + 1;

    const nuevasFotos = [];
    const stmt = db.prepare('INSERT INTO fotos (producto_id, ruta, nombre_original, orden) VALUES (?, ?, ?, ?)');
    
    db.transaction(() => {
        for (const file of req.files) {
            const ruta = `${process.env.API_URL || 'http://localhost:3000'}/uploads/${file.filename}`;
            const info = stmt.run(producto.id, ruta, file.originalname, orden);
            nuevasFotos.push({
                id: info.lastInsertRowid,
                producto_id: producto.id,
                ruta,
                nombre_original: file.originalname,
                orden
            });
            orden++;
        }
    })();

    res.json({ fotos: nuevasFotos });
}

function deleteFoto(req, res) {
    const { getDb } = require('../config/database');
    const info = getDb().prepare('DELETE FROM fotos WHERE id = ? AND producto_id = ?').run(req.params.foto_id, req.params.id);
    
    if (info.changes === 0) {
        return res.status(404).json({ error: 'Foto no encontrada en este producto' });
    }
    res.status(204).send();
}

module.exports = { index, show, store, update, destroy, uploadFotos, deleteFoto };