
import { useNavigate } from "react-router-dom";

export default function BackNav() {
  const navigate = useNavigate();
  return (
    <nav className="w-full flex items-center px-4 py-4">
      <button
        aria-label="Go back"
        className="rounded-full bg-white/10 hover:bg-white/20 p-2 shadow-lg transition-all"
        onClick={() => navigate(-1)}
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-cyan-200">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </nav>
  );
}
