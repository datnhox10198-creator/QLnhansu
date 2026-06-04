import mongoose from 'mongoose';

const assigneeSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    status: { type: String, enum: ['Pending', 'Doing', 'Done'], default: 'Pending' },
    updatedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const workTaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    workDate: { type: Date, required: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    createdByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    source: { type: String, enum: ['Manager', 'Admin'], default: 'Manager' },
    assignees: {
      type: [assigneeSchema],
      validate: {
        validator(value) {
          return value.length >= 1 && value.length <= 5;
        },
        message: 'Cong viec can tu 1 den 5 nhan vien'
      }
    }
  },
  { timestamps: true }
);

export default mongoose.model('WorkTask', workTaskSchema);
