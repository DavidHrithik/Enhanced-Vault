import React, { useState } from "react";
import Modal from "./Modal";
import { motion } from "framer-motion";

const environments = ["SIT", "QA1", "QA2", "QA3", "QA4", "DEV", "Preprod", "Preprod2"];

export default function AccountModal({ open, onClose, onSubmit, initial, originPosition }) {
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
    username: initial?.username || "",
    password: initial?.password || "",
    environment: initial?.environment || "DEV",
    owner: initial?.owner || "",
    role: initial?.role || [],
    remarks: initial?.remarks || "",
  });

  // Reset form when switching between add/edit
  React.useEffect(() => {
    setForm({
      username: initial?.username || "",
      password: initial?.password || "",
      environment: initial?.environment || "DEV",
      owner: initial?.owner || "",
      role: initial?.role || [],
    });
  }, [initial, open]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.username) errs.username = "Username required";
    if (!form.password) errs.password = "Password required";
    if (!form.environment) errs.environment = "Environment required";
    if (!form.owner) errs.owner = "Account owner required";
    if (!form.role || form.role.length === 0) errs.role = "Role required";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTagAdd = () => {
    if (tagInput && !form.tags.includes(tagInput)) {
      setForm({ ...form, tags: [...form.tags, tagInput] });
      setTagInput("");
    }
  };

  const handleTagRemove = (tag) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    await onSubmit(form, () => setLoading(false));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-modal-fade"
        onClick={onClose}
      >
        <motion.div
          ref={modalRef}
          className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl p-8 pt-10 relative min-w-[350px] w-full max-w-[540px] animate-modal-in"
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
                  {initial ? "Edit" : "Add"} Test Account
                </h2>
                <div>
                  <label className="block font-bold text-blue-200">Username</label>
                  <input
                    name="username"
                    className="border border-blue-400/30 bg-[#20243a]/80 text-blue-200 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5f5aa2] placeholder:text-blue-400 w-full"
                    placeholder="Enter username"
                    value={form.username}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.username && <div className="text-red-500 text-xs">{errors.username}</div>}
                </div>
                <div>
                  <label className="block font-bold text-blue-200">Password</label>
                  <input
                    name="password"
                    type="password"
                    className="border border-blue-400/30 bg-[#20243a]/80 text-blue-200 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5f5aa2] placeholder:text-blue-400 w-full"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.password && <div className="text-red-500 text-xs">{errors.password}</div>}
                </div>
                <div>
                  <label className="block font-bold text-blue-200">Environment</label>
                  <select
                    name="environment"
                    className="border border-blue-400/30 bg-[#20243a]/80 text-blue-200 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5f5aa2] placeholder:text-blue-400 w-full"
                    value={form.environment}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    {environments.map((env) => (
                      <option key={env} value={env}>{env}</option>
                    ))}
                  </select>
                  {errors.environment && <div className="text-red-500 text-xs">{errors.environment}</div>}
                </div>
                <div>
                  <label className="block font-bold text-blue-200 flex items-center gap-1">
                    Account Owner
                    <span title="OTP will be sent to the respective owners." className="inline-block align-middle cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-4m0-4h.01" /></svg>
                    </span>
                  </label>
                  <input
                    name="owner"
                    className="border border-blue-400/30 bg-[#20243a]/80 text-blue-200 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5f5aa2] placeholder:text-blue-400 w-full"
                    placeholder="Enter owner name"
                    value={form.owner}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.owner && <div className="text-red-500 text-xs">{errors.owner}</div>}
                </div>
                <div>
                  <label className="block font-bold text-blue-200 mb-1">Role</label>
                  <div className="flex flex-wrap gap-2 mb-1">
                    {[
                      "Hospital admin",
                      "Surgeon",
                      "Support Staff",
                      "ICadmin",
                      "IcTechnician",
                      "SN Admin",
                      "SN Manager",
                      "SN Reviewer",
                      "SN CLoud support"
                    ].map(role => (
                      <button
                        key={role}
                        type="button"
                        className={`px-3 py-1 rounded-full border text-xs font-bold transition-all ${form.role.includes(role) ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-100'}`}
                        onClick={() => {
                          setForm({
                            ...form,
                            role: form.role.includes(role)
                              ? form.role.filter(r => r !== role)
                              : [...form.role, role]
                          });
                        }}
                        disabled={loading}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                  {errors.role && <div className="text-red-500 text-xs">{errors.role}</div>}
                </div>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-bold shadow transition-all flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? <span className="animate-spin mr-2">⏳</span> : null}
                  {initial ? "Save Changes" : "Add Account"}
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
