import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';

import DeviceModal from '../components/DeviceModal';
import DeviceTable from '../components/DeviceTable';
import DeviceHistoryModal from '../components/DeviceHistoryModal';
import ConfirmationModal from '../components/ConfirmationModal';

function getRoleFromToken() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return (
      payload.role ||
      payload.ROLE ||
      payload.roles ||
      payload.authorities ||
      (payload.sub === 'admin' ? 'ADMIN' : 'USER')
    );
  } catch {
    return null;
  }
}

import * as XLSX from 'xlsx';

import BackNav from '../components/BackNav';
import UserStatus from '../components/UserStatus';
import { API_BASE_URL } from '../utils/config';
export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editIdx, setEditIdx] = useState(null);
  const [editOwner, setEditOwner] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyDeviceId, setHistoryDeviceId] = useState(null);
  const [modalOrigin, setModalOrigin] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [deleteId, setDeleteId] = useState(null);

  const role = getRoleFromToken();
  const isAdmin = role === 'ADMIN';

  // Fetch devices from backend
  const location = useLocation();

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_BASE_URL}/api/devices`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Failed to fetch devices');
      const data = await res.json();
      setDevices(data);
    } catch (_) {
      setError('Could not load devices');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDevices();
    // eslint-disable-next-line
  }, [location.key]);

  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    const fetchStatusOptions = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/options/DEVICE_STATUS`);
        if (res.ok) {
          const data = await res.json();
          setStatusOptions(data);
        }
      } catch (_) {
        console.error('Failed to fetch status options');
      }
    };
    fetchStatusOptions();
  }, []);

  // Filtered devices for Table and Export
  const filteredDevices = devices.filter(
    (d) =>
      !search ||
      d.model.toLowerCase().includes(search.toLowerCase()) ||
      (d.owner && d.owner.toLowerCase().includes(search.toLowerCase()))
  );

  const handleExport = () => {
    const dataToExport = filteredDevices.map((d) => ({
      Model: d.model,
      Owner: d.owner || 'None',
      Status: d.status || 'Available',
      'Last Updated': d.updatedDate ? new Date(d.updatedDate).toLocaleString() : 'N/A',
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Devices');
    XLSX.writeFile(wb, 'DHQ_Devices_Report.xlsx');
  };

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditOwner(devices[idx].owner);
    setEditStatus(devices[idx].status || 'Available');
  };

  const handleSave = async (idx) => {
    const device = devices[idx];
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      setError('');

      // Use the generic update endpoint
      const res = await fetch(`${API_BASE_URL}/api/devices/${device.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ owner: editOwner, status: editStatus }),
      });
      if (!res.ok) throw new Error('Failed to update device');
      setEditIdx(null);
      setEditOwner('');
      setEditStatus('');
      await fetchDevices(); // Refetch after save
    } catch (_) {
      setError('Could not update device');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setEditIdx(null);
    setEditOwner('');
    setEditStatus('');
  };

  const handleHistory = (id, e) => {
    if (e && e.target) {
      const rect = e.target.getBoundingClientRect();
      setModalOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
    setHistoryDeviceId(id);
    setHistoryModalOpen(true);
  };

  const handleAdd = (e) => {
    if (e && e.target) {
      const rect = e.target.getBoundingClientRect();
      setModalOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    } else {
      setModalOrigin({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
    setModalOpen(true);
  };

  const handleModalSubmit = async (form, done) => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_BASE_URL}/api/devices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to add device');
      setModalOpen(false);
      await fetchDevices();
    } catch (_) {
      setError('Could not add device');
    }
    done();
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_BASE_URL}/api/devices/${deleteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete device');
      await fetchDevices();
    } catch (_) {
      setError('Could not delete device');
    }
    setDeleteId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-bg-start via-bg-mid to-bg-end relative overflow-hidden"
    >
      <UserStatus />
      <BackNav />
      <main className="relative z-10 flex flex-col items-center px-4 min-h-screen w-full">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-1 mt-0 tracking-tight drop-shadow-xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary/80 animate-gradient">
              D.H.Q.
            </span>
          </h1>
          <span className="text-lg md:text-xl font-semibold text-cyan-200 mb-4 mt-0 tracking-wider block">
            See which devices are reporting for duty at D.H.Q.
          </span>
        </motion.div>

        {loading ? (
          <Loader text={editIdx !== null ? 'Saving changes...' : 'Loading devices...'} />
        ) : error ? (
          <div className="text-red-300 text-center py-12 font-bold">{error}</div>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="w-full max-w-full flex flex-col items-center"
          >
            {/* Advanced Search and Filter Controls */}
            <div className="flex flex-wrap gap-4 mb-6 w-full max-w-full items-center justify-between">
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  className="px-4 py-2 rounded-xl bg-[rgba(40,60,90,0.16)] border border-primary/30 shadow focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder:text-cyan-200 min-w-[200px] transition-all duration-200"
                  placeholder="Search by model or owner..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search devices"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2 rounded-xl bg-surface/50 border border-primary/30 text-primary font-bold shadow-lg hover:bg-primary/10 transition-all duration-200 flex items-center gap-2 cursor-pointer"
                  onClick={() => (window.location.href = '/dashboard')}
                >
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Dashboard
                </motion.button>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2 rounded-xl bg-surface border border-primary/30 text-primary font-bold shadow-lg hover:bg-primary/10 transition-all duration-200 cursor-pointer"
                  onClick={handleExport}
                >
                  Export to Excel
                </motion.button>
                {isAdmin && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-secondary to-primary text-surface font-bold shadow-lg hover:from-primary hover:to-secondary hover:text-white transition-all duration-200 cursor-pointer"
                    onClick={handleAdd}
                  >
                    + Add Device
                  </motion.button>
                )}
              </div>
            </div>

            <DeviceTable
              devices={filteredDevices}
              isAdmin={isAdmin}
              statusOptions={statusOptions}
              editIdx={editIdx}
              editOwner={editOwner}
              setEditOwner={setEditOwner}
              editStatus={editStatus}
              setEditStatus={setEditStatus}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onDelete={handleDeleteClick}
              onHistory={handleHistory}
            />
          </motion.div>
        )}
      </main>
      <DeviceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        originPosition={modalOrigin}
      />
      <DeviceHistoryModal
        open={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        deviceId={historyDeviceId}
        originPosition={modalOrigin}
      />
      <ConfirmationModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Device?"
        message="Are you sure you want to remove this device from DHQ?"
      />
    </motion.div>
  );
}
