const express = require('express');
const cors = require('cors');
const { User, Project, Bug, sequelize } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// Logger pentru terminal
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// --- RUTE AUTENTIFICARE ---
app.post('/api/auth/signup', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: "Eroare la creare utilizator (posibil email duplicat)." });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email, password: req.body.password } });
  if (user) res.json(user);
  else res.status(401).json({ error: "Email sau parolă incorectă" });
});

app.get('/api/auth/users', async (req, res) => {
  const users = await User.findAll({ attributes: ['id', 'email', 'role'] });
  res.json(users);
});

// --- RUTE PROIECTE ---
app.get('/api/projects', async (req, res) => {
  const projects = await Project.findAll();
  res.json(projects);
});

app.post('/api/projects', async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- RUTE BUG-URI (VERSIUNEA REPARATĂ) ---
app.get('/api/bugs/project/:projectId', async (req, res) => {
  try {
    console.log(`🔍 Caut bug-uri cu ProjectId = ${req.params.projectId}`);
    
    // Verific toate bug-urile din baza de date
    const allBugs = await Bug.findAll();
    console.log(`📊 Total bug-uri în DB: ${allBugs.length}`, allBugs.map(b => ({ id: b.id, title: b.title, ProjectId: b.ProjectId })));
    
    const bugs = await Bug.findAll({ 
      where: { ProjectId: req.params.projectId },
      include: [
        { model: User, as: 'assignedTo', attributes: ['email'], required: false },
        { model: User, as: 'reporter', attributes: ['email'], required: false }
      ]
    });
    console.log(`[DEBUG] Trimit ${bugs.length} bug-uri către frontend pentru proiectul ${req.params.projectId}`);
    res.json(bugs);
  } catch (err) {
    console.error("Eroare la preluare bug-uri:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bugs', async (req, res) => {
  try {
    // Ne asigurăm că ProjectId și reporterId ajung corect
    console.log("📥 Primesc bug cu date:", req.body);
    const bug = await Bug.create(req.body);
    console.log("✅ Bug salvat în DB:", bug.title, "cu ProjectId:", bug.ProjectId);
    res.status(201).json(bug);
  } catch (err) {
    console.error("❌ Eroare salvare bug:", err.message);
    console.error("Stack:", err);
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/bugs/:id/assign', async (req, res) => {
  try {
    const bug = await Bug.findByPk(req.params.id);
    if (!bug) return res.status(404).json({ error: "Bug negăsit" });
    
    await bug.update({ assignedToId: req.body.userId, status: 'In Progress' });
    
    // Returnăm bug-ul actualizat cu tot cu noul email alocat
    const updatedBug = await Bug.findByPk(req.params.id, {
        include: [{ model: User, as: 'assignedTo', attributes: ['email'] }]
    });
    res.json(updatedBug);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/bugs/:id/resolve', async (req, res) => {
  try {
    const bug = await Bug.findByPk(req.params.id);
    await bug.update({ solutionLink: req.body.solutionLink, status: 'Resolved' });
    res.json(bug);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- START ---
const PORT = 3001;
// Sincronizare bază de date - force: false = nu șterge datele existente
sequelize.sync({ force: false, alter: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 SERVER ONLINE: http://localhost:${PORT}`);
    console.log(`💡 Sfat: Dacă bug-urile nu apar, verifică ProjectId în baza de date.\n`);
  });
}).catch(err => {
  console.error("❌ Eroare la sync:", err);
});