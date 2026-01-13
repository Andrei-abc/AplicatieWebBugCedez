/**
 * SERVER BACK-END - Bug Tracker
 * Locație: server/server.js
 */
const express = require('express');
const cors = require('cors');
const { User, Project, Bug, sequelize } = require('./models');

const app = express();

// CONFIGURARE CORS: Permite comunicarea între frontend și backend
app.use(cors()); 
app.use(express.json());

// Mesaj confirmare server activ
app.get('/', (req, res) => {
  res.send('🚀 Serverul Bug Tracker este online la portul 3001');
});

// --- RUTE PROIECTE (Rezolvă eroarea de adăugare) ---
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    console.log("Date primite pentru proiect:", req.body); // Debugging în consolă terminal
    
    // Verificăm dacă datele sunt prezente
    if (!req.body.name || !req.body.repository) {
      return res.status(400).json({ error: "Numele și repository-ul sunt obligatorii." });
    }

    const project = await Project.create({
      name: req.body.name,
      repository: req.body.repository,
      ownerId: req.body.ownerId // Luat din Dashboard
    });
    
    res.status(201).json(project);
  } catch (err) {
    console.error("Eroare la salvare în SQLite:", err);
    res.status(400).json({ error: "Serverul a refuzat cererea: " + err.message });
  }
});

// --- RUTE BUG-URI ---
app.get('/api/bugs/project/:projectId', async (req, res) => {
  const bugs = await Bug.findAll({ 
    where: { ProjectId: req.params.projectId },
    include: [{ model: User, as: 'assignedTo', attributes: ['email'] }]
  });
  res.json(bugs);
});

app.post('/api/bugs', async (req, res) => {
  try {
    const bug = await Bug.create(req.body);
    res.status(201).json(bug);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/bugs/:id/assign', async (req, res) => {
  const bug = await Bug.findByPk(req.params.id);
  await bug.update({ assignedToId: req.body.userId, status: 'In Progress' });
  const updated = await Bug.findByPk(req.params.id, { 
    include: [{ model: User, as: 'assignedTo', attributes: ['email'] }] 
  });
  res.json(updated);
});

app.put('/api/bugs/:id/resolve', async (req, res) => {
  const bug = await Bug.findByPk(req.params.id);
  await bug.update({ solutionLink: req.body.solutionLink, status: 'Resolved' });
  res.json(bug);
});

// Pornire server și sincronizare
const PORT = 3001;
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`🚀 Server activ la http://localhost:${PORT}`));
});