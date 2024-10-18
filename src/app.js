const express = require('express');
const cors = require('cors');
const playerRoutes = require('./routes/playerRoutes');

const app = express();

// Configurer CORS
app.use(cors({
  origin: [process.env.CORS_ORIGIN],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Authorization'],
  credentials: true,
}));

app.use(express.json()); // Body parsing

// Importer les routes
app.use('/players', playerRoutes);

module.exports = app;
