const { Sequelize } = require('sequelize');

// Configurarea Sequelize pentru SQLite (Bază de date relațională conform cerinței)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite' // Fișierul unde se salvează datele
});

module.exports = sequelize;