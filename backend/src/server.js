import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leaves', leaveRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  if (err.status && err.status < 500) return res.status(err.status).json({ message: err.message || 'Request khong hop le' });
  if (err.code === 11000) return res.status(400).json({ message: 'Du lieu da ton tai', fields: err.keyValue });
  res.status(500).json({ message: 'Loi server' });
});

const port = process.env.PORT || 5001;
connectDB()
  .then(() => app.listen(port, () => console.log(`API running on http://localhost:${port}/api`)))
  .catch((error) => {
    console.error('MongoDB connection failed', error.message);
    process.exit(1);
  });
