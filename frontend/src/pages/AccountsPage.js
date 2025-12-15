import React, { useEffect, useState } from "react";
import { authFetch } from "../utils/auth";
import { motion } from "framer-motion";
import AccountModal from "../components/AccountModal";
import { useToast } from "../context/ToastContext";
import * as XLSX from "xlsx";



import { useNavigate } from "react-router-dom";

import BackNav from "../components/BackNav";
import UserStatus from "../components/UserStatus";
import { API_BASE_URL } from "../utils/config";
export default function AccountsPage() {
  // ... existing state and hooks ...
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [editingId, setEditingId] = React.useState(null);
  const [deletingId, setDeletingId] = React.useState(null);
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [envFilter, setEnvFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [modalOrigin, setModalOrigin] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const { showToast } = useToast();

  useEffect(() => {
    fetchAccounts();
    fetchEnvironments();
    // eslint-disable-next-line
  }, []);

  const [environments, setEnvironments] = useState([]);
  const fetchEnvironments = async () => {
    try {

      const res = await fetch(`${API_BASE_URL}/api/options/ENVIRONMENT`);
      if (res.ok) setEnvironments(await res.json());
    } catch (e) {
      console.error("Failed to fetch environments", e);
    }
  };

  const fetchAccounts = async () => {
    setLoading(true);
    try {

      const res = await authFetch(`${API_BASE_URL}/api/accounts/search`);
      const data = await res.json();
      setAccounts(data);
    } catch (err) {
      showToast("Failed to fetch accounts", "error");
    }
    setLoading(false);
  };


  const handleAdd = (e) => {
    setEditAccount(null);
    if (e && e.target) {
      const rect = e.target.getBoundingClientRect();
      setModalOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    } else {
      setModalOrigin({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
    setModalOpen(true);
  };

  const handleEdit = (account, e) => {
    setEditAccount(account);
    if (e && e.target) {
      const rect = e.target.getBoundingClientRect();
      setModalOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    } else {
      setModalOrigin({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
    setModalOpen(true);
  };

  const [pendingDelete, setPendingDelete] = useState(null);
  const handleDelete = async (id) => {
    setPendingDelete(id);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {

      await authFetch(`${API_BASE_URL}/api/accounts/${pendingDelete}`, { method: 'DELETE' });
      showToast("Account deleted");
      fetchAccounts();
    } catch {
      showToast("Failed to delete account", "error");
    }
    setPendingDelete(null);
  };

  const cancelDelete = () => setPendingDelete(null);

  const handleModalSubmit = async (form, done) => {
    try {

      if (editAccount) {
        await authFetch(`${API_BASE_URL}/api/accounts/${editAccount.id}`, {
          method: 'PUT',
          body: JSON.stringify({ ...form, owner: form.owner })
        });
        showToast("Account updated");
      } else {
        await authFetch(`${API_BASE_URL}/api/accounts`, {
          method: 'POST',
          body: JSON.stringify({ ...form, owner: form.owner })
        });
        showToast("Account added");
      }
      setModalOpen(false);
      fetchAccounts();
    } catch {
      showToast("Failed to save account", "error");
    }
    done();
  };

  // Excel download handler (must be inside component)
  const handleDownloadExcel = () => {
    if (!accounts || accounts.length === 0) return;
    const data = accounts.map(acc => ({
      Username: acc.username,
      Password: acc.password,
      Environment: acc.environment,
      Owner: acc.owner,
      Role: Array.isArray(acc.role) ? acc.role.join(", ") : acc.role
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Accounts");
    XLSX.writeFile(workbook, "accounts.xlsx");
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-[#1e2337] via-[#232946] to-[#15161c]">
      <UserStatus />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute w-[120vw] h-[120vw] left-1/2 top-[-40vw] -translate-x-1/2 bg-gradient-to-tr from-[#a7c7e7]/30 via-[#5f5aa2]/20 to-[#232946]/0 rounded-full blur-3xl animate-pulse"></div>
      </div>
      <BackNav className="mb-6" />
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pb-12">

        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#a7c7e7] via-[#5f5aa2] to-[#7ea4c7] animate-gradient">T.A.D.A.</span>
        </h1>
        <p className="text-lg text-cyan-200 mb-12 text-center max-w-2xl font-semibold">
          Not all test accounts are here yet—see which secret agents made it to T.A.D.A.!
        </p>
        <div className="w-full max-w-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8 mb-12 overflow-x-auto">
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#5f5aa2] to-[#a7c7e7] rounded-lg shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#232946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-200">
                Credentials Repository
              </span>
            </h2>
            <div className="hidden md:block text-cyan-200/60 text-sm font-mono bg-[#232946]/50 px-3 py-1 rounded-full border border-white/5">
              {accounts.length} Active Agents
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="w-full">
              <input
                className="w-full border border-blue-400/30 bg-[#20243a]/80 text-blue-200 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5f5aa2] placeholder:text-blue-400"
                placeholder="Search by username, environment, owner, or role..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#5f5aa2] to-[#a7c7e7] text-[#232946] font-bold shadow-lg hover:from-[#a7c7e7] hover:to-[#5f5aa2] hover:text-white transition-all duration-200"
              onClick={handleAdd}
            >
              + Add New Account
            </button>
            <button
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold shadow-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-200 ml-2"
              onClick={handleDownloadExcel}
            >
              Download Excel
            </button>
          </div>
          <div className="overflow-x-auto rounded-xl">
            <table className="min-w-[1300px] w-full bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl table-fixed">
              <thead className="bg-[#232946]/70">
                <tr>
                  <th className="px-4 py-3 text-left text-[#a7c7e7] font-semibold min-w-[180px]">Username</th>
                  <th className="px-4 py-3 text-left text-[#a7c7e7] font-semibold min-w-[140px]">Password</th>
                  <th className="px-4 py-3 text-left text-[#a7c7e7] font-semibold min-w-[120px]">Environment</th>
                  <th className="px-4 py-3 text-left text-[#a7c7e7] font-semibold min-w-[150px]">Owner</th>
                  <th className="px-4 py-3 text-left text-[#a7c7e7] font-semibold min-w-[150px]">Role</th>
                  <th className="px-4 py-3 text-left text-[#a7c7e7] font-semibold min-w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-[#a7c7e7]">Loading...</td>
                  </tr>
                ) : accounts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-[#a7c7e7]">No accounts found.</td>
                  </tr>
                ) : (
                  accounts
                    .filter(account => !envFilter || account.environment === envFilter)
                    .filter(account => {
                      const q = search.toLowerCase();
                      return (
                        !search ||
                        (account.username && account.username.toLowerCase().includes(q)) ||
                        (account.environment && account.environment.toLowerCase().includes(q)) ||
                        (account.owner && account.owner.toLowerCase().includes(q)) ||
                        (Array.isArray(account.role) && account.role.some(r => r && r.toLowerCase().includes(q)))
                      );
                    })
                    .map(account => (
                      <tr key={account.id} className="hover:bg-[#232946]/40 transition-all">
                        <td className="px-4 py-2 font-medium text-white/90 min-w-[180px] max-w-[250px] truncate" title={account.username}>{account.username}</td>
                        <td className="px-4 py-2 text-white/80 font-mono tracking-widest min-w-[140px] flex items-center gap-2">
                          {visiblePasswords[account.id] ? (account.password || '') : '••••••••••'}
                          <button
                            className="focus:outline-none p-1 transition-all flex items-center justify-center"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--accent, #a7c7e7)',
                              minWidth: 28,
                              minHeight: 28,
                              lineHeight: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'color 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-text, #232946)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--accent, #a7c7e7)'}
                            aria-label={visiblePasswords[account.id] ? 'Hide password' : 'Show password'}
                            title={visiblePasswords[account.id] ? 'Hide password' : 'Show password'}
                            onClick={() => setVisiblePasswords(v => ({ ...v, [account.id]: !v[account.id] }))}
                            type="button"
                          >
                            <motion.div
                              initial={false}
                              animate={{ rotate: visiblePasswords[account.id] ? 360 : 0, opacity: 1 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                              style={{ display: 'inline-block' }}
                            >
                              {visiblePasswords[account.id] ? (
                                // Eye open
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1.5 12s3.5-7 10.5-7 10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z" />
                                  <circle cx="12" cy="12" r="3.5" strokeWidth={2} />
                                </svg>
                              ) : (
                                // Eye-off (slashed eye)
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.94 17.94A10.06 10.06 0 0112 20.5c-7 0-10.5-7-10.5-7a17.47 17.47 0 014.06-5.94M1.5 12s3.5-7 10.5-7 10.5 7 10.5 7a17.47 17.47 0 01-4.06 5.94M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <motion.line
                                    x1="4" y1="4" x2="20" y2="20"
                                    stroke="#a7c7e7" strokeWidth="2" strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.3 }}
                                  />
                                </svg>
                              )}
                            </motion.div>
                          </button>
                        </td>
                        <td className="px-4 py-2 text-white/80 min-w-[120px]">{account.environment}</td>
                        <td className="px-4 py-2 text-white/80 min-w-[150px]">{account.owner || <span className="text-[#a7c7e7]">—</span>}</td>
                        <td className="px-4 py-2 text-white/80 min-w-[150px]">{account.role?.join(", ") || <span className="text-[#a7c7e7]">None</span>}</td>
                        <td className="px-4 py-2 min-w-[140px]">
                          <div className="flex flex-wrap gap-2 items-center justify-start">
                            <button
                              className="flex items-center gap-1 bg-gradient-to-r from-[#5f5aa2] to-[#a7c7e7] text-[#232946] font-bold px-3 py-1 rounded-xl shadow-lg hover:from-[#a7c7e7] hover:to-[#5f5aa2] hover:text-white transition-all duration-200"
                              onClick={e => handleEdit(account, e)}
                            >
                              Edit
                            </button>
                            <button
                              className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-pink-400 text-white font-bold px-3 py-1 rounded-xl shadow-lg hover:from-pink-400 hover:to-red-500 transition-all duration-200"
                              onClick={() => handleDelete(account.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <AccountModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleModalSubmit}
          initial={editAccount}
          originPosition={modalOrigin}
        />
        {/* Delete Confirmation Modal */}
        {pendingDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl p-8 min-w-[320px] max-w-[90vw] flex flex-col items-center animate-modal-in">
              <h2 className="text-xl font-bold mb-4 text-center text-red-300">Delete Secret Agent?</h2>
              <p className="mb-6 text-cyan-200 text-center font-semibold">Not all test accounts can stay forever—are you sure you want to send this agent on a permanent vacation from T.A.D.A.?</p>
              <div className="flex gap-4 w-full justify-center">
                <button
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#5f5aa2] to-[#a7c7e7] text-[#232946] font-bold shadow-lg hover:from-[#a7c7e7] hover:to-[#5f5aa2] hover:text-white transition-all duration-200"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-400 text-white font-bold shadow-lg hover:from-pink-400 hover:to-red-500 transition-all duration-200"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
