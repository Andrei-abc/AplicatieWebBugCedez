const { Sequelize, DataTypes } = require('sequelize');
// Initializare Sequelize cu SQLite
const sequelize = new Sequelize({ 
  dialect: 'sqlite', 
  storage: './database.sqlite', 
  logging: false 
});

// Model Utilizator
const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('MP', 'TST'), allowNull: false }
});

// Model Proiect
const Project = sequelize.define('Project', {
  name: { type: DataTypes.STRING, allowNull: false },
  repository: { type: DataTypes.STRING },
  ownerId: { type: DataTypes.INTEGER } // Adaugat pentru a salva cine a creat proiectul
});

// Model Bug
const Bug = sequelize.define('Bug', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  severity: { type: DataTypes.STRING },
  priority: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'Open' },
  solutionLink: { type: DataTypes.STRING }
});

// DEFINIRE RELATII (ORM Sequelize)
// Un proiect are multe bug-uri
Project.hasMany(Bug, { foreignKey: 'ProjectId', onDelete: 'CASCADE' });
Bug.belongsTo(Project, { foreignKey: 'ProjectId' });

// Un bug are un raportor (Tester) si un responsabil (MP)
Bug.belongsTo(User, { as: 'reporter', foreignKey: 'reporterId' });
Bug.belongsTo(User, { as: 'assignedTo', foreignKey: 'assignedToId' });

// Exportam modelele si conexiunea
module.exports = { User, Project, Bug, sequelize };