import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Chua dang nhap' });
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const user = await User.findById(decoded.id);
    if (!user || user.status !== 'Active') {
      return res.status(401).json({ message: 'Tai khoan khong hop le' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token khong hop le' });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Khong co quyen truy cap' });
  }
  next();
};
