
const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const pagesRoutes = require('./routes/pagesRoutes');
const rolesRoutes = require('./routes/rolesRoutes');
const permissionsRoutes = require('./routes/permissionsRoutes');

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.get('/ping', (req, res) => {
  res.send('Server is alive');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/permissions', permissionsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
