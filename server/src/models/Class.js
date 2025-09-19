import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    classCode: { type: String, required: true, unique: true, trim: true },
    className: { type: String, required: true, trim: true },
    tuitionFee4Weeks: { type: Number, required: true },
    tuitionFee8Weeks: { type: Number, required: true },
    tuitionFee12Weeks: { type: Number, required: true },
    branch: { type: String, required: true, trim: true },
    schedule: { type: String, required: true, trim: true },
    shift: { type: String, required: true, trim: true },
    teacher: { type: String, required: true, trim: true },
    studentCount: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    notes: { type: String, trim: true },
    packageType: {
      type: String,
      enum: ["4 tuần", "8 tuần", "12 tuần"],
      default: "4 tuần",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Class", classSchema);
