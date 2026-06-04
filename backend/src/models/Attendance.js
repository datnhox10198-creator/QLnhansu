import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    workDate: { type: String, required: true },
    checkInAt: { type: Date, required: true },
    checkOutAt: { type: Date, default: null },
    status: { type: String, enum: ['CheckedIn', 'Completed'], default: 'CheckedIn' }
  },
  { timestamps: true }
);

attendanceSchema.index({ employeeId: 1, workDate: 1 }, { unique: true });
attendanceSchema.index({ workDate: 1 });

export default mongoose.model('Attendance', attendanceSchema);
