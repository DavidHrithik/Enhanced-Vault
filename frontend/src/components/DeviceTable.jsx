import SlideInRow from './SlideInRow';

export default function DeviceTable({
    devices,
    isAdmin,
    onEdit,
    onDelete,
    onHistory,
    statusOptions,
    editIdx,
    editOwner,
    setEditOwner,
    editStatus,
    setEditStatus,
    onSave,
    onCancel
}) {
    // Filter logic here or passed down? Passed down is better, but filter is simple.
    // Let's keep filter here if we pass filtered devices, or pass full devices and search term.
    // In Page, filtering happened in render.

    // Better to filter in parent and pass "visibleDevices"

    return (
        <div className="modern-scrollbar overflow-auto w-full max-w-full mx-auto mt-0 px-2" style={{ maxHeight: '75vh' }}>
            <table className="w-full table-fixed divide-y divide-[#a7c7e7]/20 rounded-2xl overflow-hidden shadow-xl bg-[rgba(40,60,90,0.16)] backdrop-blur-xl border border-[#a7c7e7]/30" style={{ WebkitBackdropFilter: 'blur(16px)', backdropFilter: 'blur(16px)' }}>
                <thead className="bg-[rgba(30,36,55,0.75)] sticky top-0 z-10 backdrop-blur-xl" style={{ WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)' }}>
                    <tr>
                        <th className="w-[5%] min-w-[50px] px-6 py-3 text-left text-xs font-bold text-[#a7c7e7] uppercase tracking-wider">S.No</th>
                        <th className="w-[20%] min-w-[150px] px-6 py-3 text-left text-xs font-bold text-[#a7c7e7] uppercase tracking-wider">Device Model</th>
                        <th className="w-[15%] min-w-[140px] px-6 py-3 text-left text-xs font-bold text-[#a7c7e7] uppercase tracking-wider">Status</th>
                        <th className="w-[20%] min-w-[160px] px-6 py-3 text-left text-xs font-bold text-[#a7c7e7] uppercase tracking-wider">Owner</th>
                        <th className="w-[15%] min-w-[150px] px-6 py-3 text-left text-xs font-bold text-[#a7c7e7] uppercase tracking-wider">Updated Date</th>
                        <th className="w-[25%] min-w-[240px] px-6 py-3 text-left text-xs font-bold text-[#a7c7e7] uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#a7c7e7]/10">
                    {devices.map((device, idx) => (
                        <SlideInRow key={device.id || idx} delay={idx * 80}>
                            <td className="px-6 py-3 text-lg font-semibold text-white/90">{idx + 1}</td>
                            <td className="px-6 py-3 text-lg text-cyan-200 font-bold">{device.model}</td>
                            <td className="px-6 py-3">
                                {isAdmin && editIdx === idx ? (
                                    <select
                                        className="w-full bg-[rgba(255,255,255,0.16)] border border-[#a7c7e7]/40 rounded-lg px-2 py-1 text-[#232946] font-semibold focus:outline-none focus:ring-2 focus:ring-[#a7c7e7]"
                                        value={editStatus}
                                        onChange={e => setEditStatus(e.target.value)}
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
                                ) : (
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${device.status === 'Available' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                            device.status === 'In Use' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                                device.status === 'Broken' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                                                    'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                        } `}>
                                        {device.status || 'Available'}
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-3 text-lg text-green-200 font-bold">
                                {isAdmin && editIdx === idx ? (
                                    <input
                                        className="w-full bg-[rgba(255,255,255,0.16)] border border-[#a7c7e7]/40 rounded-lg px-2 py-1 text-[#232946] font-semibold focus:outline-none focus:ring-2 focus:ring-[#a7c7e7]"
                                        value={editOwner}
                                        onChange={e => setEditOwner(e.target.value)}
                                        autoFocus
                                    />
                                ) : (
                                    device.owner
                                )}
                            </td>
                            <td className="px-6 py-3 text-xs text-cyan-100 font-mono">
                                {device.updatedDate ? new Date(device.updatedDate).toLocaleString() : '--'}
                            </td>
                            <td className="px-6 py-3">
                                <div className="flex gap-2">
                                    <button
                                        className="px-3 py-1 rounded-xl bg-[#232946] border border-[#a7c7e7]/30 text-[#a7c7e7] font-bold shadow hover:bg-[#a7c7e7]/10"
                                        onClick={(e) => onHistory(device.id, e)}
                                    >
                                        History
                                    </button>
                                    {isAdmin && (
                                        <>
                                            {editIdx === idx ? (
                                                <>
                                                    <button className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#a7c7e7] to-[#5f5aa2] text-[#232946] font-bold shadow hover:bg-[#5f5aa2]" onClick={() => onSave(idx)}>Save</button>
                                                    <button className="px-3 py-1 rounded-xl bg-red-400 text-white font-bold shadow hover:bg-red-600" onClick={onCancel}>Cancel</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#a7c7e7] to-[#5f5aa2] text-[#232946] font-bold shadow hover:bg-[#5f5aa2]" onClick={() => onEdit(idx)}>Edit</button>
                                                    <button className="px-3 py-1 rounded-xl bg-gradient-to-r from-red-500 to-pink-400 text-white font-bold shadow hover:from-pink-400 hover:to-red-500" onClick={() => onDelete(device.id)}>Delete</button>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            </td>
                        </SlideInRow>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
