import { useState, useEffect } from "react";
import { authFetch } from "../utils/auth";
import BackNav from "../components/BackNav";
import UserStatus from "../components/UserStatus";
import { useToast } from "../context/ToastContext";

import ConfirmationModal from "../components/ConfirmationModal";
import RenameModal from "../components/RenameModal";

import { useConfig } from "../context/ConfigContext";
import { API_BASE_URL } from "../utils/config";
export default function AdminSettingsPage() {
    const { config, updateConfig } = useConfig();
    const [environments, setEnvironments] = useState([]);
    const [roles, setRoles] = useState([]);
    const [deviceStatuses, setDeviceStatuses] = useState([]);

    const [newEnv, setNewEnv] = useState("");
    const [newRole, setNewRole] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [renameData, setRenameData] = useState(null); // { id, value, category }
    const { showToast } = useToast();

    // Local state for config editing
    const [appName, setAppName] = useState(config.APP_NAME || "");
    const [tadaTileName, setTadaTileName] = useState(config.TADA_TILE_NAME || "");
    const [dhqTileName, setDhqTileName] = useState(config.DHQ_TILE_NAME || "");

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (config.APP_NAME) setAppName(config.APP_NAME);
        if (config.TADA_TILE_NAME) setTadaTileName(config.TADA_TILE_NAME);
        if (config.DHQ_TILE_NAME) setDhqTileName(config.DHQ_TILE_NAME);
    }, [config]);

    const handleConfigSave = async () => {
        const successName = await updateConfig("APP_NAME", appName);
        const successTada = await updateConfig("TADA_TILE_NAME", tadaTileName);
        const successDhq = await updateConfig("DHQ_TILE_NAME", dhqTileName);

        if (successName && successTada && successDhq) {
            showToast("System configuration updated successfully");
        } else {
            showToast("Failed to update configuration", "error");
        }
    };

    const fetchOptions = async () => {
        try {

            const [envRes, roleRes, statusRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/options/ENVIRONMENT`),
                fetch(`${API_BASE_URL}/api/options/ROLE`),
                fetch(`${API_BASE_URL}/api/options/DEVICE_STATUS`)
            ]);

            if (envRes.ok) setEnvironments(await envRes.json());
            if (roleRes.ok) setRoles(await roleRes.json());
            if (statusRes.ok) setDeviceStatuses(await statusRes.json());
        } catch (_) {
            showToast("Failed to load options", "error");
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchOptions();
        // eslint-disable-next-line
    }, []);

    const handleAdd = async (category, value, setValue) => {
        if (!value.trim()) return;
        try {

            const res = await authFetch(`${API_BASE_URL}/api/options`, {
                method: "POST",
                body: JSON.stringify({ category, value })
            });

            if (res.ok) {
                showToast(`${category} added successfully`);
                setValue("");
                fetchOptions();
            } else {
                showToast("Failed to add option", "error");
            }
        } catch (_) {
            showToast("Error adding option", "error");
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {

            const res = await authFetch(`${API_BASE_URL}/api/options/${deleteId}`, {
                method: "DELETE"
            });

            if (res.ok) {
                showToast("Option deleted");
                fetchOptions();
            } else {
                showToast("Failed to delete option", "error");
            }
        } catch (_) {
            showToast("Error deleting option", "error");
        }
        setDeleteId(null);
    };



    const handleRenameClick = (option) => {
        setRenameData(option);
    };

    const confirmRename = async (newValue) => {
        if (!renameData) return;
        try {

            const res = await authFetch(`${API_BASE_URL}/api/options/${renameData.id}`, {
                method: "PUT",
                body: JSON.stringify({ value: newValue })
            });

            if (res.ok) {
                showToast("Option renamed successfully");
                fetchOptions();
            } else {
                showToast("Failed to rename option", "error");
            }
        } catch (_) {
            showToast("Error renaming option", "error");
        }
        setRenameData(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1e2337] via-[#232946] to-[#15161c] text-white p-8">
            <UserStatus />
            <BackNav />
            <div className="max-w-4xl mx-auto mt-12">
                <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#a7c7e7] via-[#5f5aa2] to-[#7ea4c7]">
                    Admin Settings
                </h1>

                {/* General Settings Section */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-[#a7c7e7]">General Settings</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-blue-200 mb-1">Application Name</label>
                            <input
                                className="w-full bg-[#20243a]/80 border border-blue-400/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#5f5aa2]"
                                value={appName}
                                onChange={(e) => setAppName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-blue-200 mb-1">T.A.D.A. Tile Name</label>
                            <input
                                className="w-full bg-[#20243a]/80 border border-blue-400/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#5f5aa2]"
                                value={tadaTileName}
                                onChange={(e) => setTadaTileName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-blue-200 mb-1">D.H.Q. Tile Name</label>
                            <input
                                className="w-full bg-[#20243a]/80 border border-blue-400/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#5f5aa2]"
                                value={dhqTileName}
                                onChange={(e) => setDhqTileName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg"
                            onClick={handleConfigSave}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Environments Section */}
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-2xl font-bold mb-4 text-[#a7c7e7]">Environments</h2>
                        <div className="flex gap-2 mb-4">
                            <input
                                className="flex-1 bg-[#20243a]/80 border border-blue-400/30 rounded-lg px-3 py-2 text-blue-200 focus:outline-none focus:ring-2 focus:ring-[#5f5aa2]"
                                placeholder="New Environment"
                                value={newEnv}
                                onChange={(e) => setNewEnv(e.target.value)}
                            />
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition-all"
                                onClick={() => handleAdd("ENVIRONMENT", newEnv, setNewEnv)}
                            >
                                Add
                            </button>
                        </div>
                        <ul className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                            {environments.map((env) => (
                                <li key={env.id} className="flex justify-between items-center bg-[#232946]/50 p-3 rounded-lg border border-white/5">
                                    <span>{env.value}</span>
                                    <div className="flex gap-2">
                                        <button
                                            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 p-2 rounded-lg transition-all duration-200 border border-blue-500/20 hover:border-blue-500/40"
                                            onClick={() => handleRenameClick(env)}
                                            title="Rename Environment"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                        </button>
                                        <button
                                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition-all duration-200 border border-red-500/20 hover:border-red-500/40"
                                            onClick={() => handleDeleteClick(env.id)}
                                            title="Delete Environment"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Roles Section */}
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-2xl font-bold mb-4 text-[#a7c7e7]">Roles</h2>
                        <div className="flex gap-2 mb-4">
                            <input
                                className="flex-1 bg-[#20243a]/80 border border-blue-400/30 rounded-lg px-3 py-2 text-blue-200 focus:outline-none focus:ring-2 focus:ring-[#5f5aa2]"
                                placeholder="New Role"
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                            />
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition-all"
                                onClick={() => handleAdd("ROLE", newRole, setNewRole)}
                            >
                                Add
                            </button>
                        </div>
                        <ul className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                            {roles.map((role) => (
                                <li key={role.id} className="flex justify-between items-center bg-[#232946]/50 p-3 rounded-lg border border-white/5">
                                    <span>{role.value}</span>
                                    <div className="flex gap-2">
                                        <button
                                            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 p-2 rounded-lg transition-all duration-200 border border-blue-500/20 hover:border-blue-500/40"
                                            onClick={() => handleRenameClick(role)}
                                            title="Rename Role"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                        </button>
                                        <button
                                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition-all duration-200 border border-red-500/20 hover:border-red-500/40"
                                            onClick={() => handleDeleteClick(role.id)}
                                            title="Delete Role"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Device Status Section */}
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-2xl font-bold mb-4 text-[#a7c7e7]">Device Statuses</h2>
                        <div className="flex gap-2 mb-4">
                            <input
                                className="flex-1 bg-[#20243a]/80 border border-blue-400/30 rounded-lg px-3 py-2 text-blue-200 focus:outline-none focus:ring-2 focus:ring-[#5f5aa2]"
                                placeholder="New Status"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            />
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition-all"
                                onClick={() => handleAdd("DEVICE_STATUS", newStatus, setNewStatus)}
                            >
                                Add
                            </button>
                        </div>
                        <ul className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                            {deviceStatuses.map((status) => (
                                <li key={status.id} className="flex justify-between items-center bg-[#232946]/50 p-3 rounded-lg border border-white/5">
                                    <span>{status.value}</span>
                                    <div className="flex gap-2">
                                        <button
                                            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 p-2 rounded-lg transition-all duration-200 border border-blue-500/20 hover:border-blue-500/40"
                                            onClick={() => handleRenameClick(status)}
                                            title="Rename Status"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                        </button>
                                        <button
                                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition-all duration-200 border border-red-500/20 hover:border-red-500/40"
                                            onClick={() => handleDeleteClick(status.id)}
                                            title="Delete Status"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Delete Option?"
                message="Are you sure you want to delete this option? This action cannot be undone."
            />
            <RenameModal
                open={!!renameData}
                onClose={() => setRenameData(null)}
                onRename={confirmRename}
                initialValue={renameData?.value || ""}
                title={`Rename ${renameData?.category === 'ENVIRONMENT' ? 'Environment' : renameData?.category === 'DEVICE_STATUS' ? 'Status' : 'Role'}`}
            />
        </div >
    );
}
