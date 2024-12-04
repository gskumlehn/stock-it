const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Cria um novo produto no estoque.
 *     description: Cria um produto com as informações fornecidas. Caso o SKU já exista, um erro é retornado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               sku:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *                 format: float
 *               description:
 *                 type: string
 *               thresholdQuantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Produto criado com sucesso.
 *       400:
 *         description: Parâmetros obrigatórios ausentes.
 *       409:
 *         description: Produto já existe.
 *       500:
 *         description: Erro desconhecido.
 */
router.post('/', productController.create);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lista os produtos ativos ou inativos.
 *     description: Recupera todos os produtos no estoque, podendo filtrar por status (`active` ou `inactive`).
 *     parameters:
 *       - name: inactive
 *         in: query
 *         description: Filtrar por produtos inativos.
 *         required: false
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso.
 *       500:
 *         description: Erro desconhecido.
 */
router.get('/', productController.list);

/**
 * @swagger
 * /api/products/{sku}:
 *   get:
 *     summary: Recupera um produto pelo SKU.
 *     description: Busca um produto específico utilizando o SKU como parâmetro.
 *     parameters:
 *       - name: sku
 *         in: path
 *         required: true
 *         description: SKU do produto que será buscado.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto encontrado com sucesso.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro desconhecido.
 */
router.get('/:sku', productController.find);

/**
 * @swagger
 * /api/products/{sku}/consume:
 *   patch:
 *     summary: Reduz a quantidade de um produto no estoque.
 *     description: Atualiza a quantidade de um produto, diminuindo o valor fornecido no parâmetro `amount`.
 *     parameters:
 *       - name: sku
 *         in: path
 *         required: true
 *         description: SKU do produto a ser consumido.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: integer
 *                 description: Quantidade a ser consumida (deve ser positiva).
 *     responses:
 *       200:
 *         description: Quantidade atualizada com sucesso.
 *       400:
 *         description: Parâmetros ausentes ou quantidade insuficiente.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro desconhecido.
 */
router.patch('/:sku/consume', productController.consume);

/**
 * @swagger
 * /api/products/{sku}/restock:
 *   patch:
 *     summary: Aumenta a quantidade de um produto no estoque.
 *     description: Atualiza a quantidade de um produto, aumentando o valor fornecido no parâmetro `amount`.
 *     parameters:
 *       - name: sku
 *         in: path
 *         required: true
 *         description: SKU do produto a ser reabastecido.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: integer
 *                 description: Quantidade a ser adicionada (deve ser positiva).
 *     responses:
 *       200:
 *         description: Quantidade atualizada com sucesso.
 *       400:
 *         description: Parâmetros ausentes ou quantidade inválida.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro desconhecido.
 */
router.patch('/:sku/restock', productController.restock);

/**
 * @swagger
 * /api/products/{sku}/deactivate:
 *   patch:
 *     summary: Desativa um produto.
 *     description: Altera o status de um produto para "inactive".
 *     parameters:
 *       - name: sku
 *         in: path
 *         required: true
 *         description: SKU do produto a ser desativado.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto desativado com sucesso.
 *       400:
 *         description: Parâmetro SKU ausente ou inválido.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro desconhecido.
 */
router.patch('/:sku/deactivate', productController.deactivate);

/**
 * @swagger
 * /api/products/{sku}/reactivate:
 *   patch:
 *     summary: Reativa um produto.
 *     description: Altera o status de um produto para "active".
 *     parameters:
 *       - name: sku
 *         in: path
 *         required: true
 *         description: SKU do produto a ser reativado.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto reativado com sucesso.
 *       400:
 *         description: Parâmetro SKU ausente ou inválido.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro desconhecido.
 */
router.patch('/:sku/reactivate', productController.reactivate);

/**
 * @swagger
 * /api/products/{sku}:
 *   patch:
 *     summary: Atualiza um produto existente.
 *     description: Atualiza as informações de um produto existente utilizando o SKU.
 *     parameters:
 *       - name: sku
 *         in: path
 *         required: true
 *         description: SKU do produto a ser atualizado.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *                 format: float
 *               description:
 *                 type: string
 *               thresholdQuantity:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum:
 *                   - active
 *                   - inactive
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso.
 *       400:
 *         description: Parâmetro SKU ausente ou inválido.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro desconhecido.
 */
router.patch('/:sku', productController.update);

/**
 * @swagger
 * /api/products/{sku}:
 *   delete:
 *     summary: Remove um produto pelo SKU.
 *     description: Remove um produto específico utilizando o SKU. O produto não pode ser recuperado após a exclusão.
 *     parameters:
 *       - name: sku
 *         in: path
 *         required: true
 *         description: SKU do produto a ser removido.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Produto removido com sucesso.
 *       400:
 *         description: Parâmetro SKU ausente ou inválido.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro desconhecido.
 */
router.delete('/:sku', productController.remove);

module.exports = router;