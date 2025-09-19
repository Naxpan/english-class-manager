import React, { useEffect, useState } from "react";

function TeacherSchedule({ user }) {
  const [classes, setClasses] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:3000/api/classes`)
      .then((res) => res.json())
      .then((data) => {
        const assigned = data.data?.filter((c) =>
          user.assignedClasses?.includes(c.classCode)
        );
        setClasses(assigned || []);
      });
  }, [user]);
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-cou-700">
        Lịch dạy & Ca dạy
      </h2>
      <table className="min-w-full border rounded-xl shadow bg-white">
        <thead>
          <tr className="bg-cou-100 text-cou-700 font-bold">
            <th className="border px-4 py-2">Mã lớp</th>
            <th className="border px-4 py-2">Tên lớp</th>
            <th className="border px-4 py-2">Lịch học</th>
            <th className="border px-4 py-2">Ca dạy</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((c) => (
            <tr key={c._id}>
              <td className="border px-4 py-2">{c.classCode}</td>
              <td className="border px-4 py-2">{c.className}</td>
              <td className="border px-4 py-2">{c.schedule}</td>
              <td className="border px-4 py-2">{c.shift}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeacherSchedule;
