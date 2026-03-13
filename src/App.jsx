import React, { useState } from "react";
import { EmployeePanel } from "./component/employees/EmployeePanel.jsx";
import { AttendancePanel } from "./component/attendance/AttendancePanel.jsx";

function Sidebar({ active, onChange }) {
  const nav = [
    { id: "dashboard", icon: "⬡", label: "Dashboard" },
    { id: "employees", icon: "👥", label: "Employees" },
    { id: "attendance", icon: "📋", label: "Attendance" },
  ];
  return (
    <aside className="w-16 lg:w-56 bg-[#0d1321] border-r border-[#1e2d45] flex flex-col shrink-0">
      <div className="h-16 flex items-center px-4 border-b border-[#1e2d45] gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#4f8ef7] flex items-center justify-center text-white text-sm font-black">H</div>
        <span className="hidden lg:block text-sm font-bold text-[#e2e8f0] tracking-wide">HRMS Lite</span>
      </div>
      <nav className="flex-1 p-2 flex flex-col gap-1">
        {nav.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium w-full text-left
              ${active === id ? "bg-[#4f8ef7]/15 text-[#4f8ef7]" : "text-[#718096] hover:bg-[#1a2235] hover:text-[#e2e8f0]"}`}
          >
            <span className="text-base w-5 text-center flex-shrink-0">{icon}</span>
            <span className="hidden lg:block">{label}</span>
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-[#1e2d45]">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-7 h-7 rounded-full bg-[#4f8ef7]/20 border border-[#4f8ef7]/30 flex items-center justify-center text-xs text-[#4f8ef7] font-bold flex-shrink-0">A</div>
          <span className="hidden lg:block text-xs text-[#718096] truncate">Admin</span>
        </div>
      </div>
    </aside>
  );
}

function DashboardPage({ onNavigate }) {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-[#e2e8f0] mb-1">Welcome back, Admin 👋</h1>
        <p className="text-[#718096] mb-8">Manage your workforce from one place.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: "👥", title: "Employee Management", desc: "Add, view, and remove employees. Keep your workforce directory up to date.", action: "employees", color: "#4f8ef7" },
            { icon: "📋", title: "Attendance Tracking", desc: "Mark and review attendance for each employee across any date.", action: "attendance", color: "#a78bfa" },
          ].map(({ icon, title, desc, action, color }) => (
            <button
              key={action}
              onClick={() => onNavigate(action)}
              className="bg-[#141b2d] border border-[#1e2d45] rounded-2xl p-6 text-left hover:border-[#2d3748] hover:bg-[#1a2235] transition-all group"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{ backgroundColor: color + "20", border: `1px solid ${color}30` }}>{icon}</div>
              <h3 className="font-bold text-[#e2e8f0] mb-1 group-hover:text-white transition-colors">{title}</h3>
              <p className="text-sm text-[#718096]">{desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleSelectEmployee = (emp) => {
    setSelectedEmployee(emp);
    setPage("attendance");
  };

  return (
    <div className="flex h-screen bg-[#0f1117] font-sans overflow-hidden">
      <Sidebar active={page} onChange={setPage} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-[#1e2d45] flex items-center px-6 shrink-0 gap-2">
          <span className="text-[#4a5568] text-sm">HRMS Lite</span>
          <span className="text-[#2d3748]">/</span>
          <span className="text-sm font-medium text-[#e2e8f0] capitalize">{page}</span>
        </header>

        {page === "dashboard" && <DashboardPage onNavigate={setPage} />}

        {page === "employees" && (
          <div className="flex-1 overflow-hidden">
            <EmployeePanel onSelectEmployee={handleSelectEmployee} selectedId={selectedEmployee?.employee_id} />
          </div>
        )}

        {page === "attendance" && (
          <div className="flex-1 overflow-hidden flex">
            <div className="w-80 border-r border-[#1e2d45] flex flex-col overflow-hidden shrink-0">
              <EmployeePanel onSelectEmployee={setSelectedEmployee} selectedId={selectedEmployee?.employee_id} />
            </div>
            <div className="flex-1 overflow-hidden">
              <AttendancePanel employee={selectedEmployee} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}