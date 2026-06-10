import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    leaveDate: { type: Date, required: true },
    reason: { type: String, required: true, trim: true },
    translations: {
      en: {
        reason: { type: String, trim: true }
      }
    },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
  },
  { timestamps: true }
);

export default mongoose.model('LeaveRequest', leaveRequestSchema);
