import mongoose from "mongoose";

const otherPaymentSchema = new mongoose.Schema(
  {
    studentCode: { type: String, required: true },
    studentName: { type: String, required: true },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    shift: { type: String, enum: ["Ca 1", "Ca 2", "Ca 3"], required: true },
    totalOtherPayment: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    collector: { type: String, required: true },
    notes: { type: String, trim: true },
    receiptCode: { type: String, trim: true }, // Mã phiếu
    reason: { type: String, trim: true }, // Lý do nộp
    paymentMethod: { type: String, trim: true }, // Phương thức thanh toán
    classCode: { type: String, trim: true }, // Lớp
    branch: { type: String, trim: true }, // Chi nhánh
    bookNumber: { type: String, trim: true }, // Quyển số
    paidBy: { type: String, trim: true }, // Người nộp tiền
    writtenAmount: { type: String, trim: true }, // Số tiền viết bằng chữ
    address: { type: String, trim: true }, // Địa chỉ
    description: { type: String, trim: true }, // Diễn giải
  },
  { timestamps: true }
);

export default mongoose.model("OtherPayment", otherPaymentSchema);
