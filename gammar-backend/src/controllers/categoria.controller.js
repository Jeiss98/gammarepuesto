const slugify = require('slugify');
const Categoria = require('../models/categoria.model');

function index(req, res) {
    res.json(Categoria.getAll());
}

function show(req, res) {
    const cat = Categoria.getById(req.params.id);
    if (!cat) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(cat);
}

function store(req, res) {
    const { nombre, icono, activo = 1, orden = 0 } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' });

    const slug = slugify(nombre, { lower: true, strict: true });
    const cat = Categoria.create({ nombre, slug, icono, activo, orden });
    res.status(201).json(cat);
}

function update(req, res) {
    const cat = Categoria.getById(req.params.id);
    if (!cat) return res.status(404).json({ error: 'Categoría no encontrada' });

    const data = req.body;
    if (data.nombre && data.nombre !== cat.nombre) {
        data.slug = slugify(data.nombre, { lower: true, strict: true });
    }
    res.json(Categoria.update(req.params.id, data));
}

function destroy(req, res) {
    const cat = Categoria.getById(req.params.id);
    if (!cat) return res.status(404).json({ error: 'Categoría no encontrada' });
    Categoria.remove(req.params.id);
    res.status(204).send();
}

module.exports = { index, show, store, update, destroy };