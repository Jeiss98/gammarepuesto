require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Desactiva el caché en todas las respuestas de la API
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', require('./routes'));

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', project: 'Gama Repuestos API' });
});

app.use((_req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message || 'Error interno' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API corriendo en http://localhost:${PORT}`);
});