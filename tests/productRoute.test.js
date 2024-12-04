require('dotenv').config();
const { expect } = require('chai');
const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());

const url = '/products';
const productRoutes = require('../routes/productRoute');
app.use(url, productRoutes);

before(async () => {
    try {
        await mongoose.connect(`${process.env.DB_URI}`);
        console.log('Connected to MongoDB!');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        throw error;
    }
});

describe('Stock-it API', () => {
    
    const sku = 'TST_PRD_123'
    const productName = 'Test Product'
    const urlSku = `${url}/${sku}`
    const newProduct = {
        name: productName,
        description: 'Test Product Description',
        sku: sku,
        quantity: 10,
        threshHoldQuantity: 5,
        price: 10.00,
    };

    it('should not create product without required fields', async () => {
        const res = await request(app).post(url)
            .send({
                quantity: 10,
                threshHoldQuantity: 5,
            });

        expect(res.statusCode).to.equal(400);
        expect(res.body).to.have.property('error');
    });

    it('should create a new product', async () => {
        const res = await request(app).post(url).send(newProduct);

        expect(res.statusCode).to.equal(201);
        expect(res.body).to.have.property('message');
    });

    it('should not create a same product', async () => {
        await request(app) .post(url).send(newProduct);

        const res = await request(app).post(url).send(newProduct);

        expect(res.statusCode).to.equal(409);
        expect(res.body).to.have.property('error');
    });

    it('should find product by sku', async () => {
        await request(app).post(url).send(newProduct);

        const res = await request(app).get(urlSku);
        
        expect(res.statusCode).to.equal(200);
        expect(res.body.name).to.equal(productName);
    });

    it('should list products', async () => {
        await request(app).post(url).send(newProduct);

        const res = await request(app).get(url);
        
        expect(res.statusCode).to.equal(200);
        expect(res.body.length).to.be.greaterThan(1);
    });

    it('should update product by sku', async () => {
        await request(app).post(url).send(newProduct);

        const res = await request(app).patch(urlSku)
            .send({
                quantity: 20
            });

        expect(res.statusCode).to.equal(200);
        expect(res.body.acknowledged).to.equal(true);
    });

    it('should not update product by sku', async () => {
        await request(app).delete(urlSku);

        const res = await request(app).patch(urlSku)
            .send({
                quantity: 20
            });

        expect(res.statusCode).to.equal(404);
    });

    it('should delete product by sku', async () => {
        await request(app).post(url).send(newProduct);

        const res = await request(app).delete(urlSku);

        expect(res.statusCode).to.equal(204);
    });

    it('should not delete product by sku', async () => {
        await request(app).delete(urlSku);

        const res = await request(app).delete(urlSku);

        expect(res.statusCode).to.equal(404);
    });

    const actions = ["consume", "restock"];
    actions.forEach((action) => {
        const actionUrl = `${urlSku}/${action}`

        it(`should ${action} product quantity by sku`, async () => {
            await request(app).post(url).send(newProduct);

            const amount = 1;
            const res = await request(app).patch(actionUrl)
                .send({
                    amount: amount
                });

            expect(res.statusCode).to.equal(200);
            expect(res.body.acknowledged).to.equal(true);
        });

        const amounts = [null, -1, 0];
        amounts.forEach((amount) => {
            it(`should not ${action} product quantity by sku when amount is ${amount}`, async () => {
                await request(app).post(url).send(newProduct);

                const res = await request(app).patch(actionUrl).send({
                    amount: amount
                });

                expect(res.statusCode).to.equal(400);
            });
        });
    });

    afterEach(async () => {
        await request(app).delete(urlSku);
    });

    after(async () => {
        await mongoose.disconnect();
        console.log('MongoDB connection closed');
    });
});
