import React from "react";
import { Link, useLocation } from "react-router-dom";

const menu = [
  { label: "Quản lý tài khoản", path: "/users", roles: ["owner"] },
  { label: "Quản lý lớp học", path: "/classes" },
  { label: "Quản lý học viên", path: "/students" },
  { label: "Quản lý học phí & thu chi", path: "/enrollments" },
  { label: "Quản lý kho sách", path: "/book-stock", roles: ["teacher"] },
  { label: "Quản lý bảng lương", path: "/salary" },
  { label: "Quản lý điểm danh", path: "/attendance", roles: ["teacher"] },
  { label: "Báo cáo tổng quan", path: "/reports", roles: ["owner"] },
  { label: "Lớp đang phụ trách", path: "/assignedclass", roles: ["teacher"] },
  { label: "Lịch dạy & Ca dạy", path: "/schedule", roles: ["teacher"] },
  { label: "Bảng lương của tôi", path: "/salary-teacher", roles: ["teacher"] },
];

function Sidebar({ user }) {
  const location = useLocation();
  return (
    <aside className="w-72 min-h-screen bg-white/90 shadow-2xl flex flex-col py-10 px-6 border-r border-cou-100">
      <h2 className="text-3xl font-extrabold text-cou-700 mb-10 text-center tracking-wide drop-shadow">
        Manager
      </h2>
      <nav className="flex-1">
        <ul className="space-y-2">
          {menu
            .filter((item) => !item.roles || item.roles.includes(user.role))
            .map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block px-5 py-3 rounded-lg font-semibold transition ${
                    location.pathname === item.path
                      ? "bg-cou-100 text-cou-700 shadow"
                      : "text-cou-700 hover:bg-cou-100 hover:shadow"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
