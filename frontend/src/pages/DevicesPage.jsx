import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Loader from "../components/Loader";

import DeviceModal from "../components/DeviceModal";
import DeviceTable from "../components/DeviceTable";
import DeviceHistoryModal from "../components/DeviceHistoryModal";
import ConfirmationModal from "../components/ConfirmationModal";

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

import BackNav from "../components/BackNav";
import UserStatus from "../components/UserStatus";
import { API_BASE_URL } from "../utils/config";
export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [editOwner, setEditOwner] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyDeviceId, setHistoryDeviceId] = useState(null);
  const [modalOrigin, setModalOrigin] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [deleteId, setDeleteId] = useState(null);

  const role = getRoleFromToken();
  const isAdmin = role === 'ADMIN';

  // Fetch devices from backend
  const location = useLocation();

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_BASE_URL}/api/devices`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
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
        console.error("Failed to fetch status options");
      }
    };
    fetchStatusOptions();
  }, []);

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
      setError("");

      // Use the generic update endpoint
      const res = await fetch(`${API_BASE_URL}/api/devices/${device.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ owner: editOwner, status: editStatus })
      });
      if (!res.ok) throw new Error('Failed to update device');
      setEditIdx(null);
      setEditOwner("");
      setEditStatus("");
      await fetchDevices(); // Refetch after save
    } catch (_) {
      setError('Could not update device');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setEditIdx(null);
    setEditOwner("");
    setEditStatus("");
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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
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
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to delete device');
      await fetchDevices();
    } catch (_) {
      setError('Could not delete device');
    }
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#1e2337] via-[#232946] to-[#15161c] relative overflow-hidden">
      <UserStatus />
      <BackNav />
      <main className="relative z-10 flex flex-col items-center px-4 min-h-screen w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-1 mt-0 tracking-tight drop-shadow-xl text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#a7c7e7] via-[#5f5aa2] to-[#7ea4c7] animate-gradient">D.H.Q.</span>
        </h1>
        <span className="text-lg md:text-xl font-semibold text-cyan-200 mb-4 mt-0 text-center max-w-2xl tracking-wider">
          See which devices are reporting for duty at D.H.Q.
        </span>

        {loading ? (
          <Loader text={editIdx !== null ? "Saving changes..." : "Loading devices..."} />
        ) : error ? (
          <div className="text-red-300 text-center py-12 font-bold">{error}</div>
        ) : (
          <>
            {/* Advanced Search and Filter Controls */}
            <div className="flex flex-wrap gap-4 mb-4 w-full max-w-4xl items-center justify-between">
              <input
                type="text"
                className="px-4 py-2 rounded-xl bg-[rgba(40,60,90,0.16)] border border-[#a7c7e7]/30 shadow focus:outline-none focus:ring-2 focus:ring-[#a7c7e7] text-white placeholder:text-cyan-200 min-w-[200px]"
                placeholder="Search by model or owner..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search devices"
              />
              {isAdmin && (
                <button
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#5f5aa2] to-[#a7c7e7] text-[#232946] font-bold shadow-lg hover:from-[#a7c7e7] hover:to-[#5f5aa2] hover:text-white transition-all duration-200"
                  onClick={handleAdd}
                >
                  + Add Device
                </button>
              )}
            </div>

            <DeviceTable
              devices={devices.filter(d =>
                !search ||
                d.model.toLowerCase().includes(search.toLowerCase()) ||
                (d.owner && d.owner.toLowerCase().includes(search.toLowerCase()))
              )}
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
          </>
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
    </div>
  );
}
