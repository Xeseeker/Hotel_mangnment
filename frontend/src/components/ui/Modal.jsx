import React from "react";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-elysium-ink/65 backdrop-blur-md transition-opacity duration-500"
          onClick={onClose}
          aria-hidden
        />

        <div
          className={`relative w-full transform overflow-hidden rounded-luxury border border-gold-200/60 bg-gradient-to-b from-cream-50 via-white to-cream-100/90 text-left shadow-panel transition-all duration-500 sm:my-8 ${sizeClasses[size]}`}
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold-400/15 blur-3xl" />

          <div className="absolute right-4 top-4 z-10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gold-200/80 bg-white/90 p-2 text-dark-700 shadow-soft transition duration-300 hover:border-gold-400 hover:bg-white"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {title && (
            <div className="relative px-6 pt-8">
              <p className="luxury-badge">Guest action</p>
              <h3 className="mt-4 font-serif text-2xl font-semibold text-elysium-ink">{title}</h3>
            </div>
          )}

          <div className="relative px-6 pb-8 pt-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
