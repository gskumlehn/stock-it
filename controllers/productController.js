const Product = require('../models/product');

async function create(req, res) {
  try {
    const { name, sku, quantity, price, description, thresholdQuantity } = req.body;
    if (!name || !sku || !quantity || !price) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const product = await Product.findOne({ sku: sku });
    if (product) return res.status(409).json({ error: 'Product already exists' });

    await Product.create({ name, sku, quantity, thresholdQuantity, price, description });
    return res.status(201).json({ message: 'Product saved successfully' });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ error: 'Unknown error, contact support.' });
  }
}

async function list(req, res) {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    return res.status(500).json({ error: 'Unknown error, contact support.' });
  }
}

async function find(req, res) {
  try {
    const product = await Product.findOne({ sku: req.params.sku });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    return res.status(200).json(product);
  } catch (error) {
    console.error('Error getting product by SKU:', error);
    return res.status(500).json({ error: 'Unknown error, contact support.' });
  }
}

async function update(req, res) {
  try {
    if (!req.params.sku) return res.status(400).json({ error: 'Missing required parameter' });

    const updatedProduct = await Product.updateOne({ sku: req.params.sku }, req.body);
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product by SKU:', error);
    return res.status(500).json({ error: 'Unknown error, contact support.' });
  }
}

async function remove(req, res) {
  try {
    if (!req.params.sku) return res.status(400).json({ error: 'Missing required parameter' });

    const result = await Product.deleteOne({ sku: req.params.sku });
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error deleting product by SKU:', error);
    return res.status(500).json({ error: 'Unknown error, contact support.' });
  }
}

module.exports = {
  create,
  list,
  find,
  update,
  remove,
};