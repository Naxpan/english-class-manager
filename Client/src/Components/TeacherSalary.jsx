import React, { useEffect, useState } from "react";

function TeacherSalary({ user }) {
  const [salaries, setSalaries] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:3000/api/salaries?teacher=${user.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setSalaries(data.data || []));
  }, [user]);
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-cou-700">
        Bảng lương của tôi
      </h2>
      <table className="min-w-full border rounded-xl shadow bg-white">
        <thead>
          <tr className="bg-cou-100 text-cou-700 font-bold">
            <th className="border px-4 py-2">Tháng</th>
            <th className="border px-4 py-2">Mã lớp</th>
            <th className="border px-4 py-2">Cấp độ</th>
            <th className="border px-4 py-2">Số buổi</th>
            <th className="border px-4 py-2">Thành tiền</th>
            <th className="border px-4 py-2">Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {salaries.map((s) => (
            <tr key={s._id}>
              <td className="border px-4 py-2">{s.month}</td>
              <td className="border px-4 py-2">{s.classCode}</td>
              <td className="border px-4 py-2">{s.classLevel}</td>
              <td className="border px-4 py-2">{s.sessionCount}</td>
              <td className="border px-4 py-2">{s.totalSalary}</td>
              <td className="border px-4 py-2">
                <button className="bg-cou-400 text-white px-3 py-1 rounded hover:bg-cou-700 transition">
                  Xem chi tiết lương
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeacherSalary;
