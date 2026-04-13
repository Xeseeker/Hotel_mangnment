import React, { useEffect, useState } from "react";

const toastStyles = {
  success:
    "border-emerald-200/90 bg-gradient-to-br from-emerald-50/95 to-emerald-100/80 text-emerald-950 shadow-[0_12px_40px_-12px_rgba(47,125,104,0.35)]",
  error:
    "border-rose-200/90 bg-gradient-to-br from-rose-50/95 to-rose-100/75 text-rose-950 shadow-[0_12px_40px_-12px_rgba(185,91,81,0.3)]",
  warning:
    "border-amber-200/90 bg-gradient-to-br from-amber-50/95 to-amber-100/75 text-amber-950 shadow-[0_12px_40px_-12px_rgba(180,130,40,0.25)]",
  info:
    "border-sky-200/90 bg-gradient-to-br from-sky-50/95 to-sky-100/75 text-sky-950 shadow-[0_12px_40px_-12px_rgba(79,125,151,0.28)]",
};

const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`pointer-events-auto w-[min(92vw,24rem)] rounded-luxury border px-5 py-4 shadow-panel backdrop-blur-xl transition-all duration-500 ${toastStyles[type]} ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-current opacity-60 shadow-[0_0_12px_currentColor]" />
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] opacity-70">{type}</p>
          <p className="mt-1.5 text-sm font-medium leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;
