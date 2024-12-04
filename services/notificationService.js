require('dotenv').config()
const Product = require('../models/product');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NOTIFICATION_EMAIL,
        pass: process.env.NOTIFICATION_PASSWORD
    }
});

function sendThresholdNotificationIfNecessary(product) {
    if (product.quantity <= product.threshold) return;

    const mailOptions = {
        from: process.env.NOTIFICATION_EMAIL,
        to: process.env.EMAIL_TO_NOTIFY,
        subject: 'One of your products is running low on stock!',
        text: `Your product ${product.name} is running low on stock. The current quantity is ${product.quantity}`
    };

    console.log('Enviando email');

    return transporter.sendMail(mailOptions);
}

module.exports = {
    sendThresholdNotificationIfNecessary
};