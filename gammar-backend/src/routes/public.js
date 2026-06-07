const router = require('express').Router();
const productos = require('../controllers/producto.controller');
const categorias = require('../controllers/categoria.controller');
const servicios = require('../controllers/servicio.controller');
const info = require('../controllers/infoNegocio.controller');
const faqs = require('../controllers/faq.controller');

router.get('/productos', productos.index);
router.get('/productos/:slug', productos.show);
router.get('/categorias', categorias.index);
router.get('/servicios', servicios.index);
router.get('/info-negocio', info.show);
router.get('/faqs', faqs.index);

module.exports = router;