import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
    setTimeout(() => setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id)), 3500);
  }, []);
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={
              `px-6 py-4 rounded-2xl shadow-2xl font-bold text-white text-base backdrop-blur-lg border border-white/20 bg-white/20 animate-toast-in ` +
              (toast.type === "success"
                ? "border-green-400/60 bg-gradient-to-r from-green-400/30 to-blue-400/20"
                : toast.type === "error"
                  ? "border-red-400/60 bg-gradient-to-r from-red-400/40 to-pink-400/20"
                  : "border-blue-400/60 bg-gradient-to-r from-blue-400/40 to-cyan-400/20")
            }
            style={{ minWidth: 240 }}
          >
            {toast.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-toast-in { animation: toast-in 0.5s cubic-bezier(.4,2,.3,1) both; }
      `}</style>
    </ToastContext.Provider>
  );
}
