const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Rute untuk mendapatkan daftar produk
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Rute untuk mendapatkan detail produk berdasarkan ID
router.get('/products/:id', async (req, res) => { 
    try {
        const productId = req.params.id;
        console.log(productId);
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const multer = require('multer');

// Set up the storage engine and destination for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'img/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Create the Multer instance
const upload = multer({ storage: storage });

// Add the Multer middleware to your routes
router.post('/products', upload.single('image'), async (req, res) => {
    try {
        const newProduct = req.body;
        console.log(newProduct);
        newProduct.image = req.file.originalname; // Access the filename of the uploaded file
        const product = await Product.create(newProduct);
        res.status(201).json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Rute untuk memperbarui produk berdasarkan ID
router.put('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        console.log(productId);
        const updatedProduct = req.body;
        const product = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Rute untuk menghapus produk berdasarkan ID
router.delete('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        console.log(productId);
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.sendStatus(204);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Pembelian produk
router.post('/products/:id/buy', async (req, res) => {
    const quantity = req.body.quantity;

    if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid quantity' });
    }

    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        console.log(product);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }

        product.stock -= quantity;
        await product.save();

        res.json({ message: 'Product purchased successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to process the purchase' });
    }
});



module.exports = router;
