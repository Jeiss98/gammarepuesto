const router = require('express').Router();
const auth = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// ✅ Validación de tipo + nombre único seguro (evita colisiones y archivos peligrosos)
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, 'src/uploads/'),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const unique = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
        cb(null, unique);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
    fileFilter: (_req, file, cb) => {
        if (ALLOWED_MIME.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes (jpg, png, webp, gif)'));
        }
    }
});

const { login, me } = require('../controllers/auth.controller');
const productos = require('../controllers/producto.controller');
const categorias = require('../controllers/categoria.controller');
const servicios = require('../controllers/servicio.controller');
const info = require('../controllers/infoNegocio.controller');
const faq = require('../controllers/faq.controller');

// Abierto
router.post('/login', login);

// Protegidos
router.get('/me', auth, me);

router.get('/productos', auth, productos.index);
router.post('/productos', auth, upload.single('imagen'), productos.store);
router.get('/productos/:id', auth, productos.show);
router.put('/productos/:id', auth, upload.single('imagen'), productos.update);
router.delete('/productos/:id', auth, productos.destroy);

// Rutas para la galería de fotos
router.post('/productos/:id/fotos', auth, upload.array('fotos', 10), productos.uploadFotos);
router.delete('/productos/:id/fotos/:foto_id', auth, productos.deleteFoto);

router.get('/categorias', auth, categorias.index);
router.post('/categorias', auth, categorias.store);
router.get('/categorias/:id', auth, categorias.show);
router.put('/categorias/:id', auth, categorias.update);
router.delete('/categorias/:id', auth, categorias.destroy);

router.get('/servicios', auth, servicios.index);
router.post('/servicios', auth, servicios.store);
router.get('/servicios/:id', auth, servicios.show);
router.put('/servicios/:id', auth, servicios.update);
router.delete('/servicios/:id', auth, servicios.destroy);

router.get('/info-negocio', auth, info.show);
router.put('/info-negocio', auth, info.update);

// FAQs
router.get('/faqs', faq.index);
router.post('/faqs', auth, faq.store);
router.put('/faqs/:id', auth, faq.update);
router.delete('/faqs/:id', auth, faq.destroy);

// ✅ Manejo de error de multer (tipo de archivo inválido)
router.use((err, _req, res, _next) => {
    if (err.message && err.message.includes('Solo se permiten')) {
        return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message || 'Error interno' });
});

module.exports = router;