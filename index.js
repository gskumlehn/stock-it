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

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',  // Versão do OpenAPI
        info: {
            title: 'Stock It API',
            version: '1.0.0',
            description: 'Documentação da API para o sistema de gerenciamento de estoque.',
        },
    },
    apis: ['./routes/*.js'],  // Caminho para os arquivos de rotas
};

// Gerar a especificação do Swagger a partir dos comentários de JSDoc
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Usar o Swagger UI para servir a documentação interativa
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

//Configuração do Express para receber requisições em JSON
app.use(express.json());

//Importando as rotas
const productRoutes = require('./routes/productRoute');
app.use('/api/products', productRoutes);
