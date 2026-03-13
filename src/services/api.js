const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

// ── Employees ──────────────────────────────────────────────
export const employeeApi = {
  getAll: () => request("/employees/"),
  getById: (id) => request(`/employees/${id}`),
  create: (data) => request("/employees/", { method: "POST", body: JSON.stringify(data) }),
  delete: (id) => request(`/employees/${id}`, { method: "DELETE" }),
};

// ── Attendance ─────────────────────────────────────────────
export const attendanceApi = {
  getByEmployee: (id) => request(`/attendance/employee/${id}`),
  getByDate: (date) => request(`/attendance/date/${date}`),
  mark: (data) => request("/attendance/", { method: "POST", body: JSON.stringify(data) }),
  update: (id, date, data) =>
    request(`/attendance/employee/${id}/date/${date}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id, date) =>
    request(`/attendance/employee/${id}/date/${date}`, { method: "DELETE" }),
};