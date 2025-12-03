import React, { useState, useEffect } from 'react';

export default function RenameModal({ open, onClose, onRename, initialValue, title }) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    if (!open) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onRename(value);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1e2337] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 opacity-100">
                <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{title || 'Rename Option'}</h3>
                    <p className="text-gray-400 mb-6">Enter the new name for this option.</p>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="w-full bg-[#232946] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#a7c7e7] mb-6"
                            autoFocus
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#a7c7e7] to-[#5f5aa2] text-white font-bold hover:opacity-90 transition-opacity"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
