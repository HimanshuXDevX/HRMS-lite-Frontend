import React, { useState } from "react";
import { Button, Select, Card, Badge, EmptyState, ErrorState, Skeleton, Modal, useToast, Toast } from "../ui/index.jsx";
import { useAttendance } from "../../hooks/useData.js";

function AttendanceSkeleton() {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1e2d45]">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-8 w-24 rounded-lg" />
    </div>
  );
}

function MarkAttendanceModal({ open, onClose, employee, onMark }) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ date: today, status: "Present" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await onMark({ employee_id: employee.employee_id, date: form.date, status: form.status });
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Mark Attendance">
      <div className="flex flex-col gap-4">
        <div className="bg-[#1a2235] rounded-lg px-4 py-3 border border-[#2d3748]">
          <p className="text-xs text-[#718096] mb-0.5">Employee</p>
          <p className="text-sm font-semibold text-[#e2e8f0]">{employee?.full_name}</p>
          <p className="text-xs text-[#718096]">{employee?.employee_id}</p>
        </div>
        {error && <p className="text-sm text-[#ef4444] bg-[#7f1d1d]/20 border border-[#ef4444]/20 rounded-lg px-4 py-2">{error}</p>}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-[#718096]">Date</label>
          <input
            type="date"
            value={form.date}
            max={today}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            className="bg-[#1a2235] border border-[#2d3748] rounded-lg px-4 py-2.5 text-sm text-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#4f8ef7] focus:border-transparent transition-all"
          />
        </div>
        <Select label="Status" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </Select>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" loading={loading} onClick={handleSubmit}>Mark Attendance</Button>
        </div>
      </div>
    </Modal>
  );
}

function AttendanceRow({ record, onUpdate, onDelete }) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isPresent = record.status === "Present";

  const toggle = async () => {
    setUpdating(true);
    try { await onUpdate(record.employee_id, record.date, { status: isPresent ? "Absent" : "Present" }); }
    finally { setUpdating(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await onDelete(record.employee_id, record.date); }
    finally { setDeleting(false); }
  };

  const fmt = new Date(record.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1e2d45] last:border-0 hover:bg-[#1a2235] transition-colors">
      <span className="text-sm text-[#a0aec0] font-medium w-44 flex-shrink-0">{fmt}</span>
      <Badge variant={isPresent ? "success" : "danger"}>{record.status}</Badge>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" loading={updating} onClick={toggle}>
          Toggle
        </Button>
        <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}

function AttendanceSummary({ records }) {
  const total = records.length;
  const present = records.filter((r) => r.status === "Present").length;
  const absent = total - present;
  const rate = total ? Math.round((present / total) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-3 px-5 py-4 border-b border-[#1e2d45]">
      {[
        { label: "Present", value: present, color: "#34d399" },
        { label: "Absent", value: absent, color: "#f87171" },
        { label: "Rate", value: `${rate}%`, color: "#4f8ef7" },
      ].map(({ label, value, color }) => (
        <div key={label} className="bg-[#1a2235] rounded-xl p-3 text-center border border-[#2d3748]">
          <p className="text-xl font-bold" style={{ color }}>{value}</p>
          <p className="text-xs text-[#718096] mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}

export function AttendancePanel({ employee }) {
  const { records, loading, error, refetch, markAttendance, updateRecord, deleteRecord } = useAttendance(employee?.employee_id);
  const [showMark, setShowMark] = useState(false);
  const { toasts, toast, remove } = useToast();

  const handleMark = async (data) => {
    await markAttendance(data);
    toast("Attendance marked");
  };

  if (!employee) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <EmptyState icon="📋" title="No employee selected" description="Select an employee from the list to view and manage their attendance records." />
      </div>
    );
  }

  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2d45]">
        <div>
          <h2 className="font-bold text-[#e2e8f0] text-lg">{employee.full_name}</h2>
          <p className="text-xs text-[#718096]">{employee.department} · {employee.employee_id}</p>
        </div>
        <Button size="sm" onClick={() => setShowMark(true)}>＋ Mark</Button>
      </div>

      {!loading && records.length > 0 && <AttendanceSummary records={records} />}

      <div className="flex-1 overflow-y-auto">
        {loading && [1,2,3,4].map((i) => <AttendanceSkeleton key={i} />)}
        {error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && sorted.length === 0 && (
          <EmptyState icon="📅" title="No attendance records" description="Start tracking attendance for this employee." action={<Button size="sm" onClick={() => setShowMark(true)}>＋ Mark Attendance</Button>} />
        )}
        {!loading && !error && sorted.map((r) => (
          <AttendanceRow key={`${r.employee_id}-${r.date}`} record={r} onUpdate={updateRecord} onDelete={deleteRecord} />
        ))}
      </div>

      <MarkAttendanceModal open={showMark} onClose={() => setShowMark(false)} employee={employee} onMark={handleMark} />
      <Toast toasts={toasts} remove={remove} />
    </div>
  );
}