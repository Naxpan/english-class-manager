import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ user, allowedRoles, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Nếu không đủ quyền, chuyển về trang chủ hoặc báo lỗi
    return (
      <div className="text-red-600 text-center mt-10 font-bold">
        Bạn không có quyền truy cập trang này.
      </div>
    );
  }
  return children;
}

export default ProtectedRoute;
