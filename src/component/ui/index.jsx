import React from "react";

// ── Button ─────────────────────────────────────────────────
export function Button({ children, variant = "primary", size = "md", loading, className = "", ...props }) {
  const base = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0f1117] disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-[#4f8ef7] hover:bg-[#3a7ae8] text-white focus:ring-[#4f8ef7]",
    danger:  "bg-[#ef4444] hover:bg-[#dc2626] text-white focus:ring-[#ef4444]",
    ghost:   "bg-transparent hover:bg-white/10 text-[#a0aec0] hover:text-white focus:ring-[#4f8ef7]",
    outline: "border border-[#2d3748] hover:border-[#4f8ef7] bg-transparent text-[#e2e8f0] hover:text-[#4f8ef7] focus:ring-[#4f8ef7]",
  };
  const sizes = { sm: "px-3 py-1.5 text-sm gap-1.5", md: "px-4 py-2 text-sm gap-2", lg: "px-6 py-3 text-base gap-2" };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}

// ── Input ──────────────────────────────────────────────────
export function Input({ label, error, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold uppercase tracking-widest text-[#718096]">{label}</label>}
      <input
        className={`bg-[#1a2235] border ${error ? "border-[#ef4444]" : "border-[#2d3748]"} rounded-lg px-4 py-2.5 text-sm text-[#e2e8f0] placeholder-[#4a5568] focus:outline-none focus:ring-2 focus:ring-[#4f8ef7] focus:border-transparent transition-all ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[#ef4444]">{error}</p>}
    </div>
  );
}

// ── Select ─────────────────────────────────────────────────
export function Select({ label, error, children, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold uppercase tracking-widest text-[#718096]">{label}</label>}
      <select
        className={`bg-[#1a2235] border ${error ? "border-[#ef4444]" : "border-[#2d3748]"} rounded-lg px-4 py-2.5 text-sm text-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#4f8ef7] focus:border-transparent transition-all appearance-none cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-[#ef4444]">{error}</p>}
    </div>
  );
}

// ── Badge ──────────────────────────────────────────────────
export function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-[#2d3748] text-[#a0aec0]",
    success: "bg-[#065f46] text-[#6ee7b7]",
    danger:  "bg-[#7f1d1d] text-[#fca5a5]",
    info:    "bg-[#1e3a5f] text-[#93c5fd]",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
}

// ── Spinner ────────────────────────────────────────────────
export function Spinner({ size = "md" }) {
  const sizes = { sm: "w-3.5 h-3.5 border-[2px]", md: "w-5 h-5 border-2", lg: "w-8 h-8 border-[3px]" };
  return (
    <span className={`${sizes[size]} rounded-full border-white/20 border-t-white animate-spin inline-block flex-shrink-0`} />
  );
}

// ── Card ───────────────────────────────────────────────────
export function Card({ children, className = "", ...props }) {
  return (
    <div className={`bg-[#141b2d] border border-[#1e2d45] rounded-xl ${className}`} {...props}>
      {children}
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#1a2235] border border-[#2d3748] flex items-center justify-center text-3xl mb-4">
        {icon}
      </div>
      <h3 className="text-[#e2e8f0] font-semibold text-lg mb-1">{title}</h3>
      <p className="text-[#718096] text-sm max-w-xs mb-6">{description}</p>
      {action}
    </div>
  );
}

// ── Error State ────────────────────────────────────────────
export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#1a1a2e] border border-[#ef4444]/30 flex items-center justify-center text-3xl mb-4">⚠️</div>
      <h3 className="text-[#e2e8f0] font-semibold text-lg mb-1">Something went wrong</h3>
      <p className="text-[#718096] text-sm max-w-xs mb-6">{message}</p>
      {onRetry && <Button variant="outline" onClick={onRetry}>Try again</Button>}
    </div>
  );
}

// ── Loading Skeleton ───────────────────────────────────────
export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-[#1e2d45] rounded-lg ${className}`} />;
}

// ── Modal ──────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#141b2d] border border-[#1e2d45] rounded-2xl w-full max-w-md shadow-2xl animate-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2d45]">
          <h2 className="font-bold text-[#e2e8f0] text-lg">{title}</h2>
          <button onClick={onClose} className="text-[#718096] hover:text-[#e2e8f0] transition-colors text-xl leading-none">×</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────
export function Toast({ toasts, remove }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium transition-all
            ${t.type === "success" ? "bg-[#065f46] border-[#047857] text-[#6ee7b7]" : "bg-[#7f1d1d] border-[#991b1b] text-[#fca5a5]"}`}
        >
          <span>{t.type === "success" ? "✓" : "✕"}</span>
          <span>{t.message}</span>
          <button onClick={() => remove(t.id)} className="ml-2 opacity-60 hover:opacity-100">×</button>
        </div>
      ))}
    </div>
  );
}

// ── useToast hook ──────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = React.useState([]);
  const add = (message, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  };
  const remove = (id) => setToasts((p) => p.filter((t) => t.id !== id));
  return { toasts, toast: add, remove };
}