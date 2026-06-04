import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import payrollRoutes from './routes/payrollRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const app = express();
app.use(helmet());
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({
  origin(origin, callback) {
    const isLocalDev = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || '');
    if (!origin || allowedOrigins.includes(origin) || isLocalDev) return callback(null, true);
    return callback(new Error('Origin khong duoc phep boi CORS'));
  }
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/tasks', taskRoutes);

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
