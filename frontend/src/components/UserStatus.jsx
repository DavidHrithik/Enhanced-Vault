
import { useNavigate } from "react-router-dom";

function getRoleFromToken() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return (
      payload.role || payload.ROLE || payload.roles || payload.authorities || (payload.sub === 'admin' ? 'ADMIN' : 'USER')
    );
  } catch {
    return null;
  }
}

export default function UserStatus() {
  const navigate = useNavigate();
  const role = getRoleFromToken();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-row-reverse items-center gap-3 bg-[#232946]/80 px-4 py-2 rounded-xl shadow-lg border border-[#a7c7e7]/40">
      <span className="text-cyan-200 font-bold text-sm">Role: {role || 'Unknown'}</span>
      <button
        onClick={handleLogout}
        className="ml-2 px-3 py-1 rounded-lg bg-gradient-to-r from-[#a7c7e7] to-[#5f5aa2] text-[#232946] font-bold shadow hover:bg-[#5f5aa2] text-xs"
      >
        Logout
      </button>
    </div>
  );
}
