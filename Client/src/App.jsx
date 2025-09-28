import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ClassManager from "./Components/ClassManager";
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
import Sidebar from "./Components/Sidebar";
import TeacherAssignedClass from "./Components/TeacherAssignedClass";
import TeacherSchedule from "./Components/TeacherSchedule";
import TeacherSalary from "./Components/TeacherSalary";
import Footer from "./Components/Footer";
import Homepage from "./Components/Homepage";

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
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar - chỉ hiển thị khi đã đăng nhập */}
        {user && <Sidebar user={user} />}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          {user && (
            <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-cou-700">COU Manager</h1>
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-medium">
                    Xin chào, {user.fullName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-cou-400 text-white px-4 py-2 rounded-lg hover:bg-cou-700 transition"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </header>
          )}

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto">
            <div className="h-full">
              <Routes>
                {/* Login Route */}
                <Route
                  path="/login"
                  element={
                    user ? (
                      <Navigate to="/" replace />
                    ) : (
                      <div className="min-h-screen bg-gradient-to-r from-cou-700 to-cou-400 flex items-center justify-center">
                        <LoginRegister onAuth={setUser} />
                      </div>
                    )
                  }
                />

                {/* Homepage */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute user={user}>
                      <Homepage user={user} />
                    </ProtectedRoute>
                  }
                />

                {/* Owner Routes */}
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute user={user} allowedRoles={["owner"]}>
                      <UserManager user={user} />
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

                {/* Admin & Owner Routes */}
                <Route
                  path="/classes"
                  element={
                    <ProtectedRoute
                      user={user}
                      allowedRoles={["owner", "admin"]}
                    >
                      <ClassManager />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/students"
                  element={
                    <ProtectedRoute
                      user={user}
                      allowedRoles={["owner", "admin"]}
                    >
                      <StudentManager />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/enrollments"
                  element={
                    <ProtectedRoute
                      user={user}
                      allowedRoles={["owner", "admin"]}
                    >
                      <EnrollmentManager />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/salary"
                  element={
                    <ProtectedRoute
                      user={user}
                      allowedRoles={["owner", "admin"]}
                    >
                      <SalaryManager />
                    </ProtectedRoute>
                  }
                />

                {/* All Authenticated Users Routes */}
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

                {/* Teacher Routes */}
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

                {/* Catch all route */}
                <Route
                  path="*"
                  element={<Navigate to={user ? "/" : "/login"} />}
                />
              </Routes>
            </div>
          </main>

          {/* Footer - chỉ hiển thị khi đã đăng nhập */}
          {user && <Footer />}
        </div>
      </div>
    </Router>
  );
}

export default App;
