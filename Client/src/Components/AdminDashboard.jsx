import React from "react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Quản lý tài khoản hệ thống",
    desc: "Tạo, sửa, xóa tài khoản admin bậc thấp và giáo viên.",
    link: "/users",
  },
  {
    title: "Quản lý lớp học",
    desc: "Tạo, sửa, xóa, tìm kiếm, lọc lớp học.",
    link: "/classes",
  },
  {
    title: "Quản lý học viên",
    desc: "Tạo, sửa, xóa, tìm kiếm, lọc học viên.",
    link: "/students",
  },
  {
    title: "Quản lý học phí & thu chi",
    desc: "Thêm, sửa, xóa khoản thu, xem báo cáo thu học phí.",
    link: "/enrollments",
  },
  {
    title: "Quản lý kho sách",
    desc: "Kiểm tra tồn kho, nhập/xuất sách.",
    link: "/book-stock",
  },
  {
    title: "Quản lý bảng lương",
    desc: "Thêm, sửa, xóa bảng lương, xem tổng hợp.",
    link: "/salary",
  },
  {
    title: "Quản lý chấm công & điểm danh",
    desc: "Điểm danh lớp học, chấm công giáo viên.",
    link: "/attendance",
  },
  {
    title: "Báo cáo tổng quan",
    desc: "Xem tổng quan toàn bộ hoạt động và dữ liệu hệ thống.",
    link: "/reports",
  },
];

function AdminDashboard({ user }) {
  if (!user || user.role !== "owner") return null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">
        Dashboard Admin Bậc Cao
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-white rounded-xl shadow border border-blue-100 p-6 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold text-blue-600 mb-2">
              {f.title}
            </h2>
            <p className="mb-4 text-gray-600">{f.desc}</p>
            <Link
              to={f.link}
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Quản lý
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
