import React from "react";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-cou-700 to-cou-400 text-white py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Thông tin công ty */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-cou-700 text-2xl font-bold shadow-lg mr-4">
                C
              </div>
              <div>
                <h3 className="text-2xl font-bold">COU Manager</h3>
                <p className="text-cou-100">
                  Hệ thống quản lý trung tâm Anh ngữ
                </p>
              </div>
            </div>
            <p className="text-cou-100 mb-4">
              Giải pháp quản lý toàn diện cho các trung tâm đào tạo tiếng Anh,
              giúp tối ưu hóa quy trình quản lý học viên, giáo viên và vận hành.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-cou-100">
                <span className="mr-2">📧</span>
                <span>Phamngocman1203@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Tính năng chính */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Tính năng chính</h4>
            <ul className="space-y-2 text-cou-100">
              <li>• Quản lý học viên</li>
              <li>• Quản lý lớp học</li>
              <li>• Quản lý học phí</li>
              <li>• Quản lý bảng lương</li>
              <li>• Báo cáo tổng quan</li>
              <li>• Quản lý kho sách</li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-cou-100">
              <li>
                <a href="#" className="hover:text-white transition">
                  Hướng dẫn sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Liên hệ hỗ trợ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Báo cáo lỗi
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Đường phân cách */}
        <div className="border-t border-cou-100/20 my-6"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-cou-100 text-sm mb-4 md:mb-0">
            © 2024 COU Manager. Tất cả quyền được bảo lưu.
          </div>
          <div className="flex items-center space-x-6 text-cou-100 text-sm">
            <a href="#" className="hover:text-white transition">
              Chính sách bảo mật
            </a>
            <a href="#" className="hover:text-white transition">
              Điều khoản sử dụng
            </a>
            <div className="flex items-center">
              <span className="mr-2">🌐</span>
              <span>Phiên bản 1.0.0</span>
            </div>
          </div>
        </div>

        {/* Tech stack */}
        <div className="mt-6 pt-4 border-t border-cou-100/20">
          <div className="flex flex-wrap justify-center items-center space-x-6 text-cou-100 text-xs">
            <span>Được xây dựng với:</span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
              React.js
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Node.js
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
              MongoDB
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
              Express.js
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
              Tailwind CSS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
