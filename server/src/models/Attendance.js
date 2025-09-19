import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    classCode: { type: String, required: true },
    date: { type: Date, required: true },
    teacher: { type: String, required: true },
    students: [
      {
        studentCode: String,
        fullName: String,
        phone: String,
        status: {
          type: String,
          enum: ["present", "absent", "late"],
          default: "present",
        },
        note: String,
        tuitionPaidUntil: Date,
      },
    ],
    note: String,
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
