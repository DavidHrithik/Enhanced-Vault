import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmationModal({ open, onClose, onConfirm, title, message }) {
    if (!open) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl p-8 min-w-[320px] max-w-[90vw] flex flex-col items-center"
                    style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
                >
                    <h2 className="text-xl font-bold mb-4 text-center text-red-300">{title || "Confirm Action"}</h2>
                    <p className="mb-8 text-cyan-100 text-center font-semibold">{message || "Are you sure you want to proceed?"}</p>
                    <div className="flex gap-4 w-full justify-center">
                        <button
                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#5f5aa2] to-[#a7c7e7] text-[#232946] font-bold shadow-lg hover:from-[#a7c7e7] hover:to-[#5f5aa2] hover:text-white transition-all duration-200"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-400 text-white font-bold shadow-lg hover:from-pink-400 hover:to-red-500 transition-all duration-200"
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
