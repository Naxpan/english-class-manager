import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ClassManager from "./Components/ClassManager"; // Đúng: Components
import AdminDashboard from "./Components/AdminDashboard";
import LoginRegister from "./Components/LoginRegister";
import ProtectedRoute from "./Components/ProtectedRoute";
import UserManager from "./Components/UserManager";
import StudentManager from "./Components/StudentManager";
import EnrollmentManager from "./Components/EnrollmentManager";
import BookStockManager from "./Components/BookStockManager";
import SalaryManager from "./Components/SalaryManager";
import AttendanceManager from "./Components/AttendanceManager";
import ReportDashboard from "./Components/ReportDashboard";
import Sidebar from "./Components/Sidebar"; // Thêm dòng này
import TeacherAssignedClass from "./Components/TeacherAssignedClass";
import TeacherSchedule from "./Components/TeacherSchedule";
import TeacherSalary from "./Components/TeacherSalary";

function App() {
  const [user, setUser] = useState(null);

  // Tự động lấy profile nếu đã có token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setUser(data.user);
        });
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <Router>
      <div className="min-h-screen flex bg-gradient-to-r from-cou-700 to-cou-400 font-sans">
        {user && <Sidebar user={user} />}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {user && (
            <div className="absolute top-4 right-4 flex items-center gap-4">
              <span className="text-cou-100 font-bold text-lg drop-shadow">
                Xin chào, {user.fullName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-cou-100 text-cou-700 px-4 py-2 rounded-lg shadow font-semibold hover:bg-white hover:text-cou-700 transition"
              >
                Đăng xuất
              </button>
            </div>
          )}
          <div className="w-full max-w-5xl mx-auto p-6">
            <Routes>
              <Route
                path="/login"
                element={
                  user ? (
                    <Navigate to="/" replace />
                  ) : (
                    <LoginRegister onAuth={setUser} />
                  )
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute user={user}>
                    <div className="text-2xl font-bold text-blue-700 mt-20">
                      Xin chào, {user?.fullName}
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute user={user} allowedRoles={["owner"]}>
                    <UserManager user={user} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/classes"
                element={
                  <ProtectedRoute user={user} allowedRoles={["owner", "admin"]}>
                    <ClassManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <ProtectedRoute user={user} allowedRoles={["owner", "admin"]}>
                    <StudentManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/enrollments"
                element={
                  <ProtectedRoute user={user} allowedRoles={["owner", "admin"]}>
                    <EnrollmentManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/book-stock"
                element={
                  <ProtectedRoute
                    user={user}
                    allowedRoles={["owner", "admin", "teacher"]}
                  >
                    <BookStockManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/salary"
                element={
                  <ProtectedRoute user={user} allowedRoles={["owner", "admin"]}>
                    <SalaryManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/attendance"
                element={
                  <ProtectedRoute
                    user={user}
                    allowedRoles={["owner", "admin", "teacher"]}
                  >
                    <AttendanceManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute user={user} allowedRoles={["owner"]}>
                    <ReportDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assignedclass"
                element={
                  <ProtectedRoute user={user} allowedRoles={["teacher"]}>
                    <TeacherAssignedClass user={user} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/schedule"
                element={
                  <ProtectedRoute user={user} allowedRoles={["teacher"]}>
                    <TeacherSchedule user={user} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/salary-teacher"
                element={
                  <ProtectedRoute user={user} allowedRoles={["teacher"]}>
                    <TeacherSalary user={user} />
                  </ProtectedRoute>
                }
              />
              {/* Các route khác */}
              <Route
                path="*"
                element={<Navigate to={user ? "/" : "/login"} />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
