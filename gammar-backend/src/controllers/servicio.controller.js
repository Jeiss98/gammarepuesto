const Servicio = require('../models/servicio.model');

function index(req, res) {
    res.json(Servicio.getAll());
}

function show(req, res) {
    const s = Servicio.getById(req.params.id);
    if (!s) return res.status(404).json({ error: 'Servicio no encontrado' });
    res.json(s);
}

function store(req, res) {
    const { nombre, descripcion, icono, activo = 1, orden = 0 } = req.body;
    if (!nombre || !descripcion) return res.status(400).json({ error: 'Nombre y descripción son requeridos' });
    res.status(201).json(Servicio.create({ nombre, descripcion, icono, activo, orden }));
}

function update(req, res) {
    const s = Servicio.getById(req.params.id);
    if (!s) return res.status(404).json({ error: 'Servicio no encontrado' });
    res.json(Servicio.update(req.params.id, req.body));
}

function destroy(req, res) {
    const s = Servicio.getById(req.params.id);
    if (!s) return res.status(404).json({ error: 'Servicio no encontrado' });
    Servicio.remove(req.params.id);
    res.status(204).send();
}

module.exports = { index, show, store, update, destroy };