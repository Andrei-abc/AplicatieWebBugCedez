const express = require('express');
const cors = require('cors');
const { User, Project, Bug, sequelize } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// Logare cereri
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// --- RUTE AUTH ---
app.post('/api/auth/signup', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: "Email-ul există deja sau date invalide." });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email, password: req.body.password } });
  user ? res.json(user) : res.status(401).json({ error: "Credentiale gresite" });
});

app.get('/api/auth/users', async (req, res) => {
  const users = await User.findAll({ attributes: ['id', 'email', 'role'] });
  res.json(users);
});

// --- RUTE PROIECTE ---
app.get('/api/projects', async (req, res) => {
  res.json(await Project.findAll());
});

app.post('/api/projects', async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- RUTE BUG-URI (CORECȚIE AICI) ---
app.get('/api/bugs/project/:projectId', async (req, res) => {
  const bugs = await Bug.findAll({ 
    where: { ProjectId: req.params.projectId },
    include: [
      { model: User, as: 'assignedTo', attributes: ['email'] },
      { model: User, as: 'reporter', attributes: ['email'] }
    ]
  });
  res.json(bugs);
});

app.post('/api/bugs', async (req, res) => {
  try {
    console.log("Date primite pentru BUG:", req.body);
    // Sequelize are nevoie de ProjectId exact cu literele astea
    const bug = await Bug.create(req.body); 
    res.status(201).json(bug);
  } catch (err) {
    console.error("Eroare la salvare bug:", err.message);
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/bugs/:id/assign', async (req, res) => {
  const bug = await Bug.findByPk(req.params.id);
  if (bug) {
    await bug.update({ assignedToId: req.body.userId, status: 'In Progress' });
    res.json(bug);
  } else res.status(404).send();
});

app.put('/api/bugs/:id/resolve', async (req, res) => {
  const bug = await Bug.findByPk(req.params.id);
  if (bug) {
    await bug.update({ solutionLink: req.body.solutionLink, status: 'Resolved' });
    res.json(bug);
  } else res.status(404).send();
});

const PORT = 3001;
// Folosim alter: true pentru a adăuga coloanele noi fără a șterge datele existente
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(`🚀 Server pe port ${PORT} cu baza de date actualizată.`));
});