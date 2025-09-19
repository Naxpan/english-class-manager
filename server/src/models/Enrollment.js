import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    classInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    classCode: { type: String, required: true },
    enrollmentDate: { type: Date, default: Date.now },
    appliedTuition: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    tuitionDiscount: { type: Number, default: 0 },
    tuitionDebt: { type: Number, default: 0 },
    weeksToPayUsually: { type: Number, default: 4, enum: [4, 8, 12] },
    oldTuitionPaymentDate: { type: Date },
    newTuitionExpiryDate: { type: Date },
    newMonthTuitionPaymentDate: { type: Date },
    multiplePayments: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "completed", "dropped", "transferred"],
      default: "active",
    },
    notes: { type: String, trim: true },
    finalGrade: { type: String },
    completedDate: { type: Date },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiptCode: { type: String, trim: true }, // Mã phiếu
    reason: { type: String, trim: true }, // Lý do nộp
    paymentMethod: { type: String, trim: true }, // Phương thức đóng
    paymentCollector: { type: String, trim: true }, // Người thu
    bookNumber: { type: String, trim: true }, // Quyển số
    debtBefore: { type: Number, default: 0 }, // Nợ trước
    debtAfter: { type: Number, default: 0 }, // Nợ sau
    paidBy: { type: String, trim: true }, // Người nộp tiền
    writtenAmount: { type: String, trim: true }, // Số tiền viết bằng chữ
    compensationDate: { type: Date }, // Ngày bù học phí
    holidayDate: { type: Date }, // Ngày lễ
  },
  { timestamps: true }
);

// Index để tối ưu query
enrollmentSchema.index({ student: 1, classCode: 1 });
enrollmentSchema.index({ classCode: 1, status: 1 });
enrollmentSchema.index({ status: 1, isActive: 1 });

export default mongoose.model("Enrollment", enrollmentSchema);
