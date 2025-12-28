import Toast from "@/components/Toast";
import { useState } from "react";

export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const ToastContainer = () => {
    if (!toast) return null;

    return (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
    );
  };

  return { showToast, ToastContainer };
}
