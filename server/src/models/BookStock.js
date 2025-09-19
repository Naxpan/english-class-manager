import mongoose from "mongoose";

const bookStockSchema = new mongoose.Schema(
  {
    bookName: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    currentStock: { type: Number, default: 0 },
    imported: { type: Number, default: 0 },
    exported: { type: Number, default: 0 },
    oldStock: { type: Number, default: 0 },
    newStock: { type: Number, default: 0 },
    branch: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("BookStock", bookStockSchema);
