import { useState, useEffect, useCallback } from "react";
import { employeeApi, attendanceApi } from "../services/api";

// ── useEmployees ───────────────────────────────────────────
export function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeApi.getAll();
      setEmployees(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const addEmployee = async (payload) => {
    const created = await employeeApi.create(payload);
    setEmployees((prev) => [...prev, created]);
    return created;
  };

  const removeEmployee = async (id) => {
    await employeeApi.delete(id);
    setEmployees((prev) => prev.filter((e) => e.employee_id !== id));
  };

  return { employees, loading, error, refetch: fetchAll, addEmployee, removeEmployee };
}

// ── useAttendance ──────────────────────────────────────────
export function useAttendance(employeeId) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecords = useCallback(async () => {
    if (!employeeId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await attendanceApi.getByEmployee(employeeId);
      setRecords(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const markAttendance = async (payload) => {
    const record = await attendanceApi.mark(payload);
    setRecords((prev) => {
      const exists = prev.findIndex(
        (r) => r.employee_id === record.employee_id && r.date === record.date
      );
      if (exists >= 0) {
        const updated = [...prev];
        updated[exists] = record;
        return updated;
      }
      return [...prev, record];
    });
    return record;
  };

  const updateRecord = async (id, date, payload) => {
    const updated = await attendanceApi.update(id, date, payload);
    setRecords((prev) =>
      prev.map((r) => (r.employee_id === id && r.date === date ? updated : r))
    );
    return updated;
  };

  const deleteRecord = async (id, date) => {
    await attendanceApi.delete(id, date);
    setRecords((prev) => prev.filter((r) => !(r.employee_id === id && r.date === date)));
  };

  return { records, loading, error, refetch: fetchRecords, markAttendance, updateRecord, deleteRecord };
}