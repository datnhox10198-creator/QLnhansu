import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hrms';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  } catch (error) {
    if (error.message.includes('ECONNREFUSED')) {
      throw new Error(`Khong ket noi duoc MongoDB tai ${uri}. Hay mo MongoDB local hoac doi MONGO_URI trong backend/.env.`);
    }
    throw error;
  }
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
};
