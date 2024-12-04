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

    const product = await Product.findOne({ sku: req.params.sku });
    if (!product) return res.status(404).json({ error: 'Product not found' });

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

    const product = await Product.findOne({ sku: req.params.sku });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const result = await Product.deleteOne({ sku: req.params.sku });
    return res.status(204).json(result);
  } catch (error) {
    console.error('Error deleting product by SKU:', error);
    return res.status(500).json({ error: 'Unknown error, contact support.' });
  }
}

async function consume(req, res) {
  try {
    if (!req.params.sku) return res.status(400).json({ error: 'Missing required parameter SKU' });
    if (!req.body.amount) return res.status(400).json({ error: 'Missing required parameter Amount' });
    if (req.body.amount <= 0) return res.status(400).json({ error: 'Amount must but positive value' });

    const product = await Product.findOne({ sku: req.params.sku });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const newQuantity = product.quantity - req.body.amount;
    if (newQuantity < 0) return res.status(400).json({ error: 'Insufficient quantity' });

    const updatedProduct = await Product.updateOne({ sku: req.params.sku }, { quantity: newQuantity });
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product by SKU:', error);
    return res.status(500).json({ error: 'Unknown error, contact support.' });
  }
}

async function restock(req, res) {
  try {
    if (!req.params.sku) return res.status(400).json({ error: 'Missing required parameter SKU' });
    if (!req.body.amount) return res.status(400).json({ error: 'Missing required parameter Amount' });
    if (req.body.amount <= 0) return res.status(400).json({ error: 'Amount must but positive value' });

    const product = await Product.findOne({ sku: req.params.sku });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const newQuantity = { quantity: product.quantity + req.body.amount };
    const updatedProduct = await Product.updateOne({ sku: req.params.sku }, newQuantity);
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product by SKU:', error);
    return res.status(500).json({ error: 'Unknown error, contact support.' });
  }
}

async function deactivate(req, res) {
  try {
    if (!req.params.sku) return res.status(400).json({ error: 'Missing required parameter SKU' });

    const product = await Product.findOne({ sku: req.params.sku });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const updatedProduct = await Product.updateOne({ sku: req.params.sku }, {status: 'inactive'});
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product by SKU:', error);
    return res.status(500).json({ error: 'Unknown error, contact support.' });
  }
}

async function reactivate(req, res) {
  try {
    if (!req.params.sku) return res.status(400).json({ error: 'Missing required parameter SKU' });

    const product = await Product.findOne({ sku: req.params.sku });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const updatedProduct = await Product.updateOne({ sku: req.params.sku }, {status: 'active'});
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product by SKU:', error);
    return res.status(500).json({ error: 'Unknown error, contact support.' });
  }
}

module.exports = {
  create,
  list,
  find,
  update,
  remove,
  consume,
  restock,
  deactivate,
  reactivate,
};