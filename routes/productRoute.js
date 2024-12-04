const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/', productController.create);
router.get('/', productController.list);
router.get('/:sku', productController.find);
router.patch('/:sku', productController.update);
router.delete('/:sku', productController.remove);
router.patch('/:sku/consume', productController.consume);

module.exports = router;