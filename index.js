//Adicionando dotenv para proteger a senha do banco de dados
require('dotenv').config()

// Conexão com o MongoDB utilizando mongoose
const mongoose = require('mongoose')
const uri = process.env.DB_URI

mongoose.connect(uri)
.then(() => {
    console.log('Conectado ao MongoDB!');
})
.catch((err) => {
    console.error('Erro ao conectar ao MongoDB', err);
});

// Configuração do Express
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

//Configuração do Express para receber requisições em JSON
app.use(express.json());

//Importando as rotas
const productRoutes = require('./routes/productRoute');
app.use('/products', productRoutes);
