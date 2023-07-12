const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path')
const app = express();

// Import file db.js
require('./datauye');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/img', express.static(path.join(__dirname, 'img')))

// Import dan gunakan productRoutes
const productRoutes = require('./routes/productRoute');
app.use('/api', productRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Start the server
const port = 3001; // Anda bisa mengganti port sesuai kebutuhan
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
