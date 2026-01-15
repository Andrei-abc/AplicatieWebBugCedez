const { Bug, User } = require('../models');

exports.getAllBugs = async (req, res) => {
  try {
    const bugs = await Bug.findAll({
      include: [
        { model: User, as: 'assignedTo', attributes: ['email'], required: false },
        { model: User, as: 'reporter', attributes: ['email'], required: false }
      ]
    });
    res.json({ count: bugs.length, data: bugs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBugsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const bugs = await Bug.findAll({
      where: { ProjectId: projectId },
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'email'], required: false },
        { model: User, as: 'reporter', attributes: ['id', 'email'], required: false }
      ]
    });
    res.json({ count: bugs.length, projectId: parseInt(projectId), data: bugs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBugById = async (req, res) => {
  try {
    const bug = await Bug.findByPk(req.params.id, {
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'email'], required: false },
        { model: User, as: 'reporter', attributes: ['id', 'email'], required: false }
      ]
    });
    if (!bug) {
      return res.status(404).json({ error: "Bug negăsit" });
    }
    res.json({ data: bug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBug = async (req, res) => {
  try {
    const { title, description, severity, priority, commitLink, ProjectId, reporterId } = req.body;
    if (!title || !ProjectId) {
      return res.status(400).json({ error: "Titlu și ProjectId sunt obligatorii" });
    }
    const bug = await Bug.create({
      title, description, severity, priority, commitLink, ProjectId, reporterId, status: 'Open'
    });
    res.status(201).json({ message: 'Bug creat cu succes', data: bug });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateBug = async (req, res) => {
  try {
    const bug = await Bug.findByPk(req.params.id);
    if (!bug) {
      return res.status(404).json({ error: "Bug negăsit" });
    }
    await bug.update(req.body);
    const updatedBug = await Bug.findByPk(req.params.id, {
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'email'], required: false },
        { model: User, as: 'reporter', attributes: ['id', 'email'], required: false }
      ]
    });
    res.json({ message: 'Bug actualizat cu succes', data: updatedBug });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.assignBug = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId este obligatoriu" });
    }
    const bug = await Bug.findByPk(id);
    if (!bug) {
      return res.status(404).json({ error: "Bug negăsit" });
    }
    await bug.update({ assignedToId: userId, status: 'In Progress' });
    const updatedBug = await Bug.findByPk(id, {
      include: [{ model: User, as: 'assignedTo', attributes: ['id', 'email'] }]
    });
    res.json({ message: 'Bug alocat cu succes', data: updatedBug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resolveBug = async (req, res) => {
  try {
    const { id } = req.params;
    const { solutionLink } = req.body;
    const bug = await Bug.findByPk(id);
    if (!bug) {
      return res.status(404).json({ error: "Bug negăsit" });
    }
    await bug.update({ solutionLink, status: 'Resolved' });
    const updatedBug = await Bug.findByPk(id, {
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'email'], required: false },
        { model: User, as: 'reporter', attributes: ['id', 'email'], required: false }
      ]
    });
    res.json({ message: 'Bug marcat ca rezolvat', data: updatedBug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBug = async (req, res) => {
  try {
    const bug = await Bug.findByPk(req.params.id);
    if (!bug) {
      return res.status(404).json({ error: "Bug negăsit" });
    }
    await bug.destroy();
    res.json({ message: 'Bug șters cu succes' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
