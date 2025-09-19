import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Không có token, truy cập bị từ chối",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token không hợp lệ",
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }
    next();
  };
};

export const checkOwnership = (req, res, next) => {
  const { role, assignedClasses, branch } = req.user;

  // Owner có thể truy cập tất cả
  if (role === "owner") {
    return next();
  }

  // Admin chỉ có thể truy cập chi nhánh của mình
  if (role === "admin" && req.query.branch && req.query.branch !== branch) {
    return res.status(403).json({
      success: false,
      message: "Không có quyền truy cập chi nhánh này",
    });
  }

  // Teacher chỉ có thể truy cập lớp được gán
  if (role === "teacher") {
    req.teacherClasses = assignedClasses;
  }

  next();
};
