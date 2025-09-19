import mongoose from "mongoose";

const payrollSummarySchema = new mongoose.Schema(
  {
    month: { type: String, required: true },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalSessions: { type: Number, required: true },
    totalSalary: { type: Number, required: true },
    salaryFactor: { type: Number, default: 1 },
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("PayrollSummary", payrollSummarySchema);
