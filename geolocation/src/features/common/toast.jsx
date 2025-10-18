// src/components/NeoToast.jsx
import { useEffect } from "react";

const NeoToast = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose?.(), 5000); // auto close after 5s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`neo-toast neo-toast--${type}`}>
      <span className="neo-toast__text">{message}</span>
    </div>
  );
};

export default NeoToast;
