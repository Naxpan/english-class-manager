import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    month: { type: String, required: true }, // "2024-06"
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    classCode: { type: String, required: true },
    classLevel: { type: String, trim: true },
    salaryPerSession: { type: Number, required: true },
    sessionCount: { type: Number, required: true },
    totalSalary: { type: Number, required: true },
    note: { type: String, trim: true },
    salaryFactor: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("Salary", salarySchema);
