import React, { useEffect, useState } from "react";

function ReportDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/api/reports/overview", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data.data || null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Báo cáo tổng quan hệ thống
      </h2>
      {loading && (
        <div className="mb-4 text-blue-600 font-semibold">
          Đang tải dữ liệu...
        </div>
      )}
      {!loading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Tài khoản hệ thống
            </h3>
            <div className="space-y-1">
              <p>
                Admin bậc cao:{" "}
                <span className="font-bold">{stats.ownerCount}</span>
              </p>
              <p>
                Admin bậc thấp:{" "}
                <span className="font-bold">{stats.adminCount}</span>
              </p>
              <p>
                Giáo viên:{" "}
                <span className="font-bold">{stats.teacherCount}</span>
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Lớp học & Học viên
            </h3>
            <div className="space-y-1">
              <p>
                Tổng số lớp học:{" "}
                <span className="font-bold">{stats.classCount}</span>
              </p>
              <p>
                Tổng số học viên:{" "}
                <span className="font-bold">{stats.studentCount}</span>
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Tài chính
            </h3>
            <div className="space-y-1">
              <p>
                Tổng thu học phí:{" "}
                <span className="font-bold">
                  {stats.totalTuition?.toLocaleString()} VNĐ
                </span>
              </p>
              <p>
                Tổng chi lương:{" "}
                <span className="font-bold">
                  {stats.totalSalary?.toLocaleString()} VNĐ
                </span>
              </p>
              <p>
                Tổng thu khác:{" "}
                <span className="font-bold">
                  {stats.totalOtherIncome?.toLocaleString()} VNĐ
                </span>
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Kho sách
            </h3>
            <div className="space-y-1">
              <p>
                Tổng đầu sách:{" "}
                <span className="font-bold">{stats.bookCount}</span>
              </p>
              <p>
                Tổng số sách tồn kho:{" "}
                <span className="font-bold">{stats.totalBookStock}</span>
              </p>
            </div>
          </div>
        </div>
      )}
      {!loading && !stats && (
        <div className="text-red-600">Không lấy được dữ liệu báo cáo.</div>
      )}
    </div>
  );
}

export default ReportDashboard;
