import React from "react";

export default function Toast({ message, type, onClose }) {
  return (
    <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg text-white transition-all ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`}>
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button className="ml-4" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
}
