import jwt from 'jsonwebtoken';
import Employee from '../models/Employee.js';
import User from '../models/User.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'dev_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Email hoac mat khau khong dung' });
  }
  if (user.status !== 'Active') {
    return res.status(403).json({ message: 'Tai khoan da bi khoa' });
  }

  const employee = await Employee.findOne({ userId: user._id }).populate('departmentId');
  const safeUser = user.toObject();
  delete safeUser.password;

  res.json({ token: signToken(user._id), user: safeUser, employee });
};

export const me = async (req, res) => {
  const employee = await Employee.findOne({ userId: req.user._id }).populate('departmentId');
  res.json({ user: req.user, employee });
};
