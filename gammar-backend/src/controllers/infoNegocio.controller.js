const InfoNegocio = require('../models/infoNegocio.model');

function show(req, res) {
    const info = InfoNegocio.get();
    if (!info) return res.status(404).json({ error: 'Info del negocio no configurada' });
    res.json(info);
}

function update(req, res) {
    const info = InfoNegocio.get();
    if (!info) return res.status(404).json({ error: 'Info del negocio no encontrada' });
    res.json(InfoNegocio.update(info.id, req.body));
}

module.exports = { show, update };
