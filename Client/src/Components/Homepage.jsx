import React from "react";
import { Link } from "react-router-dom";

function Homepage({ user }) {
  const getQuickActions = () => {
    if (user.role === "owner") {
      return [
        { title: "Quản lý tài khoản", path: "/users", icon: "👥" },
        { title: "Báo cáo tổng quan", path: "/reports", icon: "📊" },
        { title: "Quản lý lớp học", path: "/classes", icon: "🎓" },
        { title: "Quản lý học viên", path: "/students", icon: "👨‍🎓" },
      ];
    }
    if (user.role === "admin") {
      return [
        { title: "Quản lý lớp học", path: "/classes", icon: "🎓" },
        { title: "Quản lý học viên", path: "/students", icon: "👨‍🎓" },
        { title: "Quản lý học phí", path: "/enrollments", icon: "💰" },
        { title: "Quản lý bảng lương", path: "/salary", icon: "💼" },
      ];
    }
    if (user.role === "teacher") {
      return [
        { title: "Lớp đang phụ trách", path: "/assignedclass", icon: "🎓" },
        { title: "Lịch dạy & Ca dạy", path: "/schedule", icon: "📅" },
        { title: "Bảng lương của tôi", path: "/salary-teacher", icon: "💰" },
        { title: "Quản lý điểm danh", path: "/attendance", icon: "✅" },
      ];
    }
    return [];
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  const getRoleTitle = () => {
    switch (user.role) {
      case "owner":
        return "Chủ sở hữu";
      case "admin":
        return "Quản trị viên";
      case "teacher":
        return "Giáo viên";
      default:
        return "Người dùng";
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-cou-400 to-cou-700 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-cou-700 mb-2">
            {getGreeting()}, {user.fullName}!
          </h1>
          <p className="text-xl text-cou-400 font-semibold">
            {getRoleTitle()} • {user.branch || "Hệ thống"}
          </p>
          <div className="mt-4 text-gray-600">
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-cou-700 mb-6 text-center">
          Thao tác nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getQuickActions().map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 p-6 transition-all duration-300 hover:scale-105"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{action.icon}</div>
                <h3 className="text-lg font-semibold text-cou-700 group-hover:text-cou-400 transition">
                  {action.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-r from-cou-400 to-cou-700 rounded-2xl shadow-lg text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Vai trò</h3>
              <p className="text-2xl font-bold">{getRoleTitle()}</p>
            </div>
            <div className="text-3xl opacity-75">👤</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-2xl shadow-lg text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Chi nhánh</h3>
              <p className="text-2xl font-bold">{user.branch || "Tất cả"}</p>
            </div>
            <div className="text-3xl opacity-75">🏢</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl shadow-lg text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Trạng thái</h3>
              <p className="text-2xl font-bold">Hoạt động</p>
            </div>
            <div className="text-3xl opacity-75">✨</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-cou-700 mb-6 text-center">
          Tính năng hệ thống
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Quản lý thông minh",
              desc: "Hệ thống quản lý toàn diện",
              icon: "🧠",
            },
            {
              title: "Báo cáo chi tiết",
              desc: "Thống kê và phân tích dữ liệu",
              icon: "📈",
            },
            {
              title: "Bảo mật cao",
              desc: "Phân quyền người dùng an toàn",
              icon: "🔒",
            },
            {
              title: "Giao diện thân thiện",
              desc: "Dễ sử dụng, hiện đại",
              icon: "🎨",
            },
            {
              title: "Đồng bộ real-time",
              desc: "Cập nhật dữ liệu ngay lập tức",
              icon: "⚡",
            },
            { title: "Hỗ trợ 24/7", desc: "Luôn sẵn sàng hỗ trợ", icon: "🎧" },
          ].map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl hover:bg-gray-50 transition"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-cou-700 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
