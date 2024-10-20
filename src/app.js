const express = require('express');
const cors = require('cors');
const playerRoutes = require('./routes/playerRoutes');
const clashRoutes = require('./routes/clashRoutes');

const app = express();

// Configurer CORS
app.use(cors({
  origin: [process.env.CORS_ORIGIN || 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Authorization']
}));

app.use(express.json()); // Body parsing

// Importer les routes
app.use('/players', playerRoutes);
app.use('/clash', clashRoutes);

module.exports = app;
