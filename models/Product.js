const mongoose = require('mongoose');

// Definisikan schema untuk produk
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true },
    image: { type: String, required: true }
});

// Buat model produk berdasarkan schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
