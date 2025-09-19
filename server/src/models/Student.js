import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentCode: { type: String, required: true, unique: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    address: { type: String, trim: true },
    dateOfBirth: { type: Date },
    parentName: { type: String, trim: true },
    parentPhone: { type: String, trim: true },
    // Thông tin chung
    notes: { type: String, trim: true },
    // Trạng thái học sinh
    status: {
      type: String,
      enum: ["active", "inactive", "graduated"],
      default: "active",
    },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // Thêm các trường mới
    tuitionDiscount: { type: Number, default: 0 }, // Giảm học phí
    registeredClasses: [{ type: String, trim: true }], // Danh sách mã lớp đã đăng ký
    debt: { type: Number, default: 0 }, // Nợ học phí
    lastPaymentDate: { type: Date }, // Ngày đóng học phí gần nhất
    paymentHistory: [
      {
        amount: Number,
        date: Date,
        note: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
