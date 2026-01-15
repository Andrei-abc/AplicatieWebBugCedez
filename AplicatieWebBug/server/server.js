const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const bugRoutes = require('./routes/bugRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/bugs', bugRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Rută negăsită' });
});

const PORT = 3001;

sequelize.sync({ force: false, alter: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 SERVER ONLINE: http://localhost:${PORT}`);
      console.log(`📁 API Endpoints:`);
      console.log(`   - POST   /api/auth/signup`);
      console.log(`   - POST   /api/auth/login`);
      console.log(`   - GET    /api/auth/users`);
      console.log(`   - GET    /api/projects`);
      console.log(`   - POST   /api/projects`);
      console.log(`   - GET    /api/bugs`);
      console.log(`   - POST   /api/bugs`);
      console.log(`   - GET    /api/bugs/project/:id`);
      console.log(`   - PUT    /api/bugs/:id/assign`);
      console.log(`   - PUT    /api/bugs/:id/resolve\n`);
    });
  })
  .catch(err => {
    console.error("❌ Eroare la sincronizare bază de date:", err);
    process.exit(1);
  });
