const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({ 
  dialect: 'sqlite', 
  storage: './database.sqlite', 
  logging: false 
});

const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('MP', 'TST'), allowNull: false }
});

const Project = sequelize.define('Project', {
  name: { type: DataTypes.STRING, allowNull: false },
  repository: { type: DataTypes.STRING },
  ownerId: { type: DataTypes.INTEGER }
});

const Bug = sequelize.define('Bug', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  severity: { type: DataTypes.STRING },
  priority: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'Open' },
  solutionLink: { type: DataTypes.STRING }
});

// RELAȚII (Configurare strictă)
Project.hasMany(Bug, { foreignKey: 'ProjectId', onDelete: 'CASCADE' });
Bug.belongsTo(Project, { foreignKey: 'ProjectId' });

Bug.belongsTo(User, { as: 'reporter', foreignKey: 'reporterId' });
Bug.belongsTo(User, { as: 'assignedTo', foreignKey: 'assignedToId' });

module.exports = { User, Project, Bug, sequelize };