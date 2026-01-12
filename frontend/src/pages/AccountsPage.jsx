import { useEffect, useState, useMemo } from 'react';
import { authFetch } from '../utils/auth';
import { motion } from 'framer-motion';
import AccountModal from '../components/AccountModal';
import { useToast } from '../context/ToastContext';
import * as XLSX from 'xlsx';

import BackNav from '../components/BackNav';
import UserStatus from '../components/UserStatus';
import ColumnHeader from '../components/ColumnHeader';
import { API_BASE_URL } from '../utils/config';
export default function AccountsPage() {
  // ... existing state and hooks ...
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [accounts, setAccounts] = useState([]);
  // Removed old simple search
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [filters, setFilters] = useState({});

  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [modalOrigin, setModalOrigin] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const { showToast } = useToast();

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/api/accounts/search`);
      const data = await res.json();
      setAccounts(data);
    } catch (_) {
      showToast('Failed to fetch accounts', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAccounts();
    // eslint-disable-next-line
  }, []);

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
      showToast('Account deleted');
      fetchAccounts();
    } catch {
      showToast('Failed to delete account', 'error');
    }
    setPendingDelete(null);
  };

  const cancelDelete = () => setPendingDelete(null);

  const handleModalSubmit = async (form, done) => {
    try {
      if (editAccount) {
        await authFetch(`${API_BASE_URL}/api/accounts/${editAccount.id}`, {
          method: 'PUT',
          body: JSON.stringify({ ...form, owner: form.owner }),
        });
        showToast('Account updated');
      } else {
        await authFetch(`${API_BASE_URL}/api/accounts`, {
          method: 'POST',
          body: JSON.stringify({ ...form, owner: form.owner }),
        });
        showToast('Account added');
      }
      setModalOpen(false);
      fetchAccounts();
    } catch {
      showToast('Failed to save account', 'error');
    }
    done();
  };

  // Filter and Sort Logic
  const filteredAndSortedAccounts = useMemo(() => {
    let result = [...accounts];

    // Filter
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        const filterVal = filters[key].toLowerCase();
        result = result.filter((acc) => {
          let val = '';
          if (key === 'role') {
            val = Array.isArray(acc.role) ? acc.role.join(', ') : acc.role || '';
          } else {
            val = acc[key] ? String(acc[key]) : '';
          }
          return val.toLowerCase().includes(filterVal);
        });
      }
    });

    // Sort
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === 'role') {
          valA = Array.isArray(valA) ? valA.join(', ') : valA || '';
          valB = Array.isArray(valB) ? valB.join(', ') : valB || '';
        } else {
          valA = valA ? String(valA) : '';
          valB = valB ? String(valB) : '';
        }

        valA = valA.toLowerCase();
        valB = valB.toLowerCase();

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [accounts, filters, sortConfig]);

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
  };

  const handleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Excel download handler (must be inside component)
  const handleDownloadExcel = () => {
    if (!accounts || accounts.length === 0) return;
    const data = accounts.map((acc) => ({
      Username: acc.username,
      Password: acc.password,
      Environment: acc.environment,
      Owner: acc.owner,
      Role: Array.isArray(acc.role) ? acc.role.join(', ') : acc.role,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Accounts');
    XLSX.writeFile(workbook, 'accounts.xlsx');
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
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#a7c7e7] via-[#5f5aa2] to-[#7ea4c7] animate-gradient">
            T.A.D.A.
          </span>
        </h1>
        <p className="text-lg text-cyan-200 mb-12 text-center max-w-2xl font-semibold">
          Not all test accounts are here yet—see which secret agents made it to T.A.D.A.!
        </p>
        <div className="w-full max-w-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8 mb-12 overflow-x-auto">
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#5f5aa2] to-[#a7c7e7] rounded-lg shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#232946]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
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
                className="w-full border border-blue-400/30 bg-[#20243a]/80 text-blue-200 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5f5aa2] placeholder:text-blue-400 opacity-50 cursor-not-allowed"
                placeholder="Use column headers to filter..."
                disabled
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
          <div className="w-full">
            <div className="hidden md:block overflow-x-auto rounded-xl">
              <table className="min-w-[1300px] w-full bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl table-fixed">
                <thead className="bg-[#232946]/70">
                  <tr>
                    <th className="px-4 py-3 text-left text-[#a7c7e7] font-semibold min-w-[180px]">
                      <ColumnHeader
                        title="Username"
                        columnKey="username"
                        sortConfig={sortConfig}
                        filters={filters}
                        onSort={handleSort}
                        onFilter={handleFilter}
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-[#a7c7e7] font-semibold min-w-[140px]">
                      Password
                    </th>
                    <th className="px-4 py-3 text-left text-[#a7c7e7] font-semibold min-w-[120px]">
                      <ColumnHeader
                        title="Environment"
                        columnKey="environment"
                        sortConfig={sortConfig}
                        filters={filters}
                        onSort={handleSort}
                        onFilter={handleFilter}
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-[#a7c7e7] font-semibold min-w-[150px]">
                      <ColumnHeader
                        title="Owner"
                        columnKey="owner"
                        sortConfig={sortConfig}
                        filters={filters}
                        onSort={handleSort}
                        onFilter={handleFilter}
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-[#a7c7e7] font-semibold min-w-[150px]">
                      <ColumnHeader
                        title="Role"
                        columnKey="role"
                        sortConfig={sortConfig}
                        filters={filters}
                        onSort={handleSort}
                        onFilter={handleFilter}
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-[#a7c7e7] font-semibold min-w-[140px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-[#a7c7e7]">
                        Loading...
                      </td>
                    </tr>
                  ) : accounts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-[#a7c7e7]">
                        No accounts found.
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedAccounts.map((account) => (
                      <tr key={account.id} className="hover:bg-[#232946]/40 transition-all">
                        <td
                          className="px-4 py-2 font-medium text-white/90 min-w-[180px] max-w-[250px] truncate"
                          title={account.username}
                        >
                          {account.username}
                        </td>
                        <td className="px-4 py-2 text-white/80 font-mono tracking-widest min-w-[140px] flex items-center gap-2">
                          {visiblePasswords[account.id] ? account.password || '' : '••••••••••'}
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
                              transition: 'color 0.2s',
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.color = 'var(--primary-text, #232946)')
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.color = 'var(--accent, #a7c7e7)')
                            }
                            aria-label={
                              visiblePasswords[account.id] ? 'Hide password' : 'Show password'
                            }
                            title={visiblePasswords[account.id] ? 'Hide password' : 'Show password'}
                            onClick={() =>
                              setVisiblePasswords((v) => ({ ...v, [account.id]: !v[account.id] }))
                            }
                            type="button"
                          >
                            <motion.div
                              initial={false}
                              animate={{
                                rotate: visiblePasswords[account.id] ? 360 : 0,
                                opacity: 1,
                              }}
                              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                              style={{ display: 'inline-block' }}
                            >
                              {visiblePasswords[account.id] ? (
                                // Eye open
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M1.5 12s3.5-7 10.5-7 10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z"
                                  />
                                  <circle cx="12" cy="12" r="3.5" strokeWidth={2} />
                                </svg>
                              ) : (
                                // Eye-off (slashed eye)
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.94 17.94A10.06 10.06 0 0112 20.5c-7 0-10.5-7-10.5-7a17.47 17.47 0 014.06-5.94M1.5 12s3.5-7 10.5-7 10.5 7 10.5 7a17.47 17.47 0 01-4.06 5.94M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <motion.line
                                    x1="4"
                                    y1="4"
                                    x2="20"
                                    y2="20"
                                    stroke="#a7c7e7"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.3 }}
                                  />
                                </svg>
                              )}
                            </motion.div>
                          </button>
                        </td>
                        <td className="px-4 py-2 text-white/80 min-w-[120px]">
                          {account.environment}
                        </td>
                        <td className="px-4 py-2 text-white/80 min-w-[150px]">
                          {account.owner || <span className="text-[#a7c7e7]">—</span>}
                        </td>
                        <td className="px-4 py-2 text-white/80 min-w-[150px]">
                          {account.role?.join(', ') || <span className="text-[#a7c7e7]">None</span>}
                        </td>
                        <td className="px-4 py-2 min-w-[140px]">
                          <div className="flex flex-wrap gap-2 items-center justify-start">
                            <button
                              className="flex items-center gap-1 bg-gradient-to-r from-[#5f5aa2] to-[#a7c7e7] text-[#232946] font-bold px-3 py-1 rounded-xl shadow-lg hover:from-[#a7c7e7] hover:to-[#5f5aa2] hover:text-white transition-all duration-200"
                              onClick={(e) => handleEdit(account, e)}
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

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-4">
              {loading ? (
                <div className="text-center text-[#a7c7e7] py-8">Loading accounts...</div>
              ) : filteredAndSortedAccounts.length === 0 ? (
                <div className="text-center text-[#a7c7e7] py-8">No accounts found.</div>
              ) : (
                filteredAndSortedAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="bg-[#232946]/90 backdrop-blur-xl border border-[#a7c7e7]/20 p-5 rounded-2xl shadow-lg flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-start border-b border-[#a7c7e7]/10 pb-3 mb-1">
                      <div>
                        <span className="text-xs font-bold text-[#a7c7e7] uppercase tracking-wide">
                          Username
                        </span>
                        <div
                          className="text-lg text-white font-bold truncate max-w-[200px]"
                          title={account.username}
                        >
                          {account.username}
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-500/30">
                        {account.environment}
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between bg-[#1b1e2e]/50 p-2 rounded-lg border border-[#a7c7e7]/10">
                        <div>
                          <span className="text-xs font-bold text-[#a7c7e7] uppercase tracking-wide block mb-1">
                            Password
                          </span>
                          <div className="font-mono text-white/90 tracking-widest text-sm">
                            {visiblePasswords[account.id] ? account.password || '' : '••••••••••'}
                          </div>
                        </div>
                        <button
                          className="focus:outline-none p-2 rounded-full hover:bg-white/5 transition-colors"
                          onClick={() =>
                            setVisiblePasswords((v) => ({ ...v, [account.id]: !v[account.id] }))
                          }
                          aria-label={
                            visiblePasswords[account.id] ? 'Hide password' : 'Show password'
                          }
                        >
                          {visiblePasswords[account.id] ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-[#a7c7e7]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-[#a7c7e7]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-bold text-[#a7c7e7] uppercase tracking-wide">
                            Owner
                          </span>
                          <div className="text-white text-sm">
                            {account.owner || <span className="text-[#a7c7e7]">—</span>}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#a7c7e7] uppercase tracking-wide">
                            Role
                          </span>
                          <div className="text-white text-sm">
                            {Array.isArray(account.role)
                              ? account.role.join(', ')
                              : account.role || <span className="text-[#a7c7e7]">None</span>}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-2 pt-3 border-t border-[#a7c7e7]/10">
                      <button
                        className="flex-1 px-4 py-2 rounded-xl bg-[#a7c7e7]/10 text-[#a7c7e7] font-bold border border-[#a7c7e7]/30 hover:bg-[#a7c7e7]/20 transition-all text-sm"
                        onClick={(e) => handleEdit(account, e)}
                      >
                        Edit
                      </button>
                      <button
                        className="flex-1 px-4 py-2 rounded-xl bg-red-500/10 text-red-300 font-bold border border-red-500/30 hover:bg-red-500/20 transition-all text-sm"
                        onClick={() => handleDelete(account.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
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
              <h2 className="text-xl font-bold mb-4 text-center text-red-300">
                Delete Secret Agent?
              </h2>
              <p className="mb-6 text-cyan-200 text-center font-semibold">
                Not all test accounts can stay forever—are you sure you want to send this agent on a
                permanent vacation from T.A.D.A.?
              </p>
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
