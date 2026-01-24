
const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const pagesRoutes = require('./routes/pagesRoutes');
const rolesRoutes = require('./routes/rolesRoutes');
const permissionsRoutes = require('./routes/permissionsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const careerRoutes = require('./routes/careerRoutes');

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend
  credentials: true
}));
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/ping', (req, res) => {
  res.send('Server is alive');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/permissions', permissionsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/careers', careerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
