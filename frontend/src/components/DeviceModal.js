import React, { useState } from "react";
import Modal from "./Modal";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../utils/config";

export default function DeviceModal({ open, onClose, onSubmit, originPosition }) {
    // Compute modal animation origin
    const modalRef = React.useRef(null);
    const [center, setCenter] = React.useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    React.useEffect(() => {
        if (modalRef.current) {
            const rect = modalRef.current.getBoundingClientRect();
            setCenter({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            });
        }
    }, [open]);

    const [showContent, setShowContent] = React.useState(false);
    React.useEffect(() => {
        if (open) {
            setShowContent(false);
            const t = setTimeout(() => setShowContent(true), 250);
            return () => clearTimeout(t);
        } else {
            setShowContent(false);
        }
    }, [open]);

    const [form, setForm] = useState({
        model: "",
        owner: "",
        status: "Available"
    });

    const [statusOptions, setStatusOptions] = useState([]);

    React.useEffect(() => {
        if (open) {
            fetchStatusOptions();
        }
    }, [open]);

    const fetchStatusOptions = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/options/DEVICE_STATUS`);
            if (res.ok) {
                const data = await res.json();
                setStatusOptions(data);
            }
        } catch (err) {
            console.error("Failed to fetch status options");
        }
    };

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const errs = {};
        if (!form.model) errs.model = "Device model required";
        if (!form.owner) errs.owner = "Owner required";
        return errs;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length) return;
        setLoading(true);
        await onSubmit(form, () => {
            setLoading(false);
            setLoading(false);
            setForm({ model: "", owner: "", status: "Available" }); // Reset form
        });
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div
                className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-modal-fade"
                onClick={onClose}
            >
                <motion.div
                    ref={modalRef}
                    className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl p-8 pt-10 relative min-w-[350px] w-full max-w-[450px] animate-modal-in"
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
                    {showContent ? (
                        <>
                            <button
                                className="absolute top-3 right-4 text-white bg-gradient-to-r from-[#a7c7e7] to-[#5f5aa2] rounded-full w-8 h-8 flex items-center justify-center shadow hover:from-[#5f5aa2] hover:to-[#a7c7e7] focus:outline-none"
                                onClick={onClose}
                                aria-label="Close modal"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <h2 className="text-2xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#a7c7e7] via-[#5f5aa2] to-[#232946] drop-shadow-lg">
                                    Add New Device
                                </h2>
                                <div>
                                    <label className="block font-bold text-blue-200">Device Model</label>
                                    <input
                                        name="model"
                                        className="border border-blue-400/30 bg-[#20243a]/80 text-blue-200 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5f5aa2] placeholder:text-blue-400 w-full"
                                        placeholder="e.g. iPhone 15, Samsung S24"
                                        value={form.model}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                    {errors.model && <div className="text-red-500 text-xs">{errors.model}</div>}
                                </div>
                                <div>
                                    <label className="block font-bold text-blue-200">Current Owner</label>
                                    <input
                                        name="owner"
                                        className="border border-blue-400/30 bg-[#20243a]/80 text-blue-200 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5f5aa2] placeholder:text-blue-400 w-full"
                                        placeholder="e.g. QA Team, John Doe"
                                        value={form.owner}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                    {errors.owner && <div className="text-red-500 text-xs">{errors.owner}</div>}
                                </div>
                                <div>
                                    <label className="block font-bold text-blue-200">Status</label>
                                    <select
                                        name="status"
                                        className="border border-blue-400/30 bg-[#20243a]/80 text-blue-200 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5f5aa2] w-full"
                                        value={form.status}
                                        onChange={handleChange}
                                        disabled={loading}
                                    >
                                        {statusOptions.length > 0 ? (
                                            statusOptions.map(opt => (
                                                <option key={opt.id} value={opt.value}>{opt.value}</option>
                                            ))
                                        ) : (
                                            <>
                                                <option value="Available">Available</option>
                                                <option value="In Use">In Use</option>
                                                <option value="Broken">Broken</option>
                                                <option value="Maintenance">Maintenance</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-bold shadow transition-all flex items-center justify-center"
                                    disabled={loading}
                                >
                                    {loading ? <span className="animate-spin mr-2">⏳</span> : null}
                                    Add Device
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 w-full">
                            <span className="mb-2 text-blue-200 font-bold text-lg">Loading...</span>
                            <span className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-400 border-opacity-40 border-t-[#a7c7e7] border-b-[#5f5aa2]"></span>
                        </div>
                    )}
                </motion.div>
            </div>
        </Modal>
    );
}
