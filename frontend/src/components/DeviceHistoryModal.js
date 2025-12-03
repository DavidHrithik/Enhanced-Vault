import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../utils/config";

export default function DeviceHistoryModal({ open, onClose, deviceId, originPosition }) {
    const modalRef = React.useRef(null);
    const [center, setCenter] = React.useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    React.useEffect(() => {
        if (modalRef.current) {
            const rect = modalRef.current.getBoundingClientRect();
            setCenter({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            });
        }
    }, [open]);

    useEffect(() => {
        if (open && deviceId) {
            fetchLogs();
        }
    }, [open, deviceId]);

    const fetchLogs = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/devices/${deviceId}/logs`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            if (!res.ok) throw new Error('Failed to fetch logs');
            const data = await res.json();
            setLogs(data);
        } catch (err) {
            setError('Could not load history');
        }
        setLoading(false);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div
                className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-modal-fade"
                onClick={onClose}
            >
                <motion.div
                    ref={modalRef}
                    className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl p-8 pt-10 relative min-w-[500px] w-full max-w-[700px] animate-modal-in max-h-[80vh] flex flex-col"
                    style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
                    onClick={(e) => e.stopPropagation()}
                    initial={originPosition ? {
                        opacity: 0,
                        scale: 0.7,
                        x: originPosition.x - center.x,
                        y: originPosition.y - center.y
                    } : { opacity: 0, scale: 0.95, x: 0, y: 0 }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.35, type: 'spring', stiffness: 220, damping: 22 }}
                >
                    <button
                        className="absolute top-3 right-4 text-white bg-gradient-to-r from-[#a7c7e7] to-[#5f5aa2] rounded-full w-8 h-8 flex items-center justify-center shadow hover:from-[#5f5aa2] hover:to-[#a7c7e7] focus:outline-none"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    <h2 className="text-2xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#a7c7e7] via-[#5f5aa2] to-[#232946] drop-shadow-lg shrink-0">
                        Device History
                    </h2>

                    <div className="overflow-auto custom-scrollbar flex-1 pr-2">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></span>
                            </div>
                        ) : error ? (
                            <div className="text-red-300 text-center py-4">{error}</div>
                        ) : logs.length === 0 ? (
                            <div className="text-blue-200 text-center py-4">No history found.</div>
                        ) : (
                            <div className="space-y-3">
                                {logs.map((log) => (
                                    <div key={log.id} className="bg-[#20243a]/60 rounded-lg p-3 border border-blue-400/20">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-[#a7c7e7] text-sm">{log.action}</span>
                                            <span className="text-xs text-blue-300 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                                        </div>
                                        <div className="text-white text-sm mb-1">{log.details}</div>
                                        <div className="text-xs text-blue-400 text-right">by {log.performedBy}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </Modal>
    );
}
