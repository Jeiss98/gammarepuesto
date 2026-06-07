const router = require('express').Router();

router.use('/public', require('./public'));
router.use('/admin', require('./admin'));

module.exports = router;