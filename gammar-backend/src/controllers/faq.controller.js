const Faq = require('../models/faq.model');

function index(req, res) {
    res.json(Faq.getAll());
}

function store(req, res) {
    res.status(201).json(Faq.create(req.body));
}

function update(req, res) {
    const r = Faq.update(req.params.id, req.body);
    r ? res.json(r) : res.status(404).json({ error: 'FAQ no encontrada' });
}

function destroy(req, res) {
    Faq.remove(req.params.id);
    res.json({ message: 'FAQ eliminada' });
}

module.exports = { index, store, update, destroy };
