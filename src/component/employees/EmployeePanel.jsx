import React, { useState } from "react";
import { Button, Input, Select, Card, Badge, EmptyState, ErrorState, Skeleton, Modal, useToast, Toast } from "../ui/index.jsx";
import { useEmployees } from "../../hooks/useData.js";

const DEPARTMENTS = ["Engineering", "Product", "Design", "Marketing", "Sales", "HR", "Finance", "Operations"];

function EmployeeSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-56" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-8 w-16 rounded-lg" />
    </div>
  );
}

function AddEmployeeModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({ employee_id: "", full_name: "", email: "", department: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.employee_id.trim()) e.employee_id = "Required";
    if (!form.full_name.trim()) e.full_name = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.department) e.department = "Required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await onAdd(form);
      setForm({ employee_id: "", full_name: "", email: "", department: "" });
      setErrors({});
      onClose();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => { setForm((p) => ({ ...p, [k]: e.target.value })); setErrors((p) => ({ ...p, [k]: undefined })); };

  return (
    <Modal open={open} onClose={onClose} title="Add New Employee">
      <div className="flex flex-col gap-4">
        {errors.submit && <p className="text-sm text-[#ef4444] bg-[#7f1d1d]/20 border border-[#ef4444]/20 rounded-lg px-4 py-2">{errors.submit}</p>}
        <Input label="Employee ID" placeholder="e.g. EMP-001" value={form.employee_id} onChange={set("employee_id")} error={errors.employee_id} />
        <Input label="Full Name" placeholder="Jane Smith" value={form.full_name} onChange={set("full_name")} error={errors.full_name} />
        <Input label="Email Address" type="email" placeholder="jane@company.com" value={form.email} onChange={set("email")} error={errors.email} />
        <Select label="Department" value={form.department} onChange={set("department")} error={errors.department}>
          <option value="">Select department…</option>
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </Select>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" loading={loading} onClick={handleSubmit}>Add Employee</Button>
        </div>
      </div>
    </Modal>
  );
}

function EmployeeRow({ emp, onDelete, onSelect, selected }) {
  const [deleting, setDeleting] = useState(false);
  const initials = emp.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const colors = ["#4f8ef7", "#a78bfa", "#34d399", "#f472b6", "#fb923c"];
  const color = colors[emp.employee_id.charCodeAt(emp.employee_id.length - 1) % colors.length];

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm(`Delete ${emp.full_name}? This will also remove all attendance records.`)) return;
    setDeleting(true);
    try { await onDelete(emp.employee_id); } finally { setDeleting(false); }
  };

  return (
    <div
      onClick={() => onSelect(emp)}
      className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition-all duration-150 hover:bg-[#1a2235] border-b border-[#1e2d45] last:border-0 ${selected ? "bg-[#1a2235]" : ""}`}
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-white" style={{ backgroundColor: color + "33", border: `1.5px solid ${color}55`, color }}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#e2e8f0] truncate">{emp.full_name}</p>
        <p className="text-xs text-[#718096] truncate">{emp.email}</p>
      </div>
      <div className="hidden sm:flex items-center gap-3">
        <Badge variant="info">{emp.department}</Badge>
        <span className="text-xs text-[#4a5568] font-mono">{emp.employee_id}</span>
      </div>
      <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete} className="flex-shrink-0">
        Delete
      </Button>
    </div>
  );
}

export function EmployeePanel({ onSelectEmployee, selectedId }) {
  const { employees, loading, error, refetch, addEmployee, removeEmployee } = useEmployees();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const { toasts, toast, remove } = useToast();

  const handleAdd = async (data) => {
    await addEmployee(data);
    toast("Employee added successfully");
  };

  const handleDelete = async (id) => {
    await removeEmployee(id);
    toast("Employee deleted");
    if (selectedId === id) onSelectEmployee(null);
  };

  const filtered = employees.filter((e) =>
    `${e.full_name} ${e.email} ${e.employee_id} ${e.department}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2d45]">
        <div>
          <h2 className="font-bold text-[#e2e8f0] text-lg">Employees</h2>
          <p className="text-xs text-[#718096]">{employees.length} total</p>
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)}>＋ Add</Button>
      </div>
      <div className="px-4 py-3 border-b border-[#1e2d45]">
        <Input placeholder="Search employees…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && [1,2,3].map((i) => <EmployeeSkeleton key={i} />)}
        {error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState icon="👤" title={search ? "No results found" : "No employees yet"} description={search ? "Try a different search term." : "Add your first employee to get started."} action={!search && <Button size="sm" onClick={() => setShowAdd(true)}>＋ Add Employee</Button>} />
        )}
        {!loading && !error && filtered.map((emp) => (
          <EmployeeRow key={emp.employee_id} emp={emp} onDelete={handleDelete} onSelect={onSelectEmployee} selected={selectedId === emp.employee_id} />
        ))}
      </div>

      <AddEmployeeModal open={showAdd} onClose={() => setShowAdd(false)} onAdd={handleAdd} />
      <Toast toasts={toasts} remove={remove} />
    </div>
  );
}