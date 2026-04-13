import React, { useCallback, useContext, useMemo, useState } from "react";
import Toast from "./Toast";

const ToasterContext = React.createContext(null);

export const useToaster = () => {
  const context = useContext(ToasterContext);

  if (!context) {
    throw new Error("useToaster must be used within a ToasterProvider");
  }

  return context;
};

export const ToasterProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      addToast,
      removeToast,
    }),
    [addToast, removeToast],
  );

  return (
    <ToasterContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 space-y-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToasterContext.Provider>
  );
};

export const Toaster = () => null;

export default Toaster;
