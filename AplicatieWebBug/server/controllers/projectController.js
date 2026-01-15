const { Project, Bug } = require('../models');

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [{ model: Bug, attributes: ['id'], required: false }]
    });
    res.json({ count: projects.length, data: projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name, repository, ownerId } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Nume proiect obligatoriu" });
    }
    const project = await Project.create({ name, repository, ownerId });
    res.status(201).json({ message: 'Proiect creat cu succes', data: project });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [{ model: Bug, required: false }]
    });
    if (!project) {
      return res.status(404).json({ error: "Proiect negăsit" });
    }
    res.json({ data: project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Proiect negăsit" });
    }
    await project.update(req.body);
    res.json({ message: 'Proiect actualizat cu succes', data: project });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Proiect negăsit" });
    }
    await project.destroy();
    res.json({ message: 'Proiect șters cu succes' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
