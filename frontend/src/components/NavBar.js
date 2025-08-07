import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = token ? parseJwt(token) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="w-full flex items-center justify-between px-8 py-3 fixed top-0 left-0 z-30 shadow-lg"
      style={{
        background: "var(--surface, #fff)",
        color: "var(--primary-text, #232946)",
        borderBottom: "1.5px solid var(--accent, #a7c7e7)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 2px 24px 0 rgba(30,36,55,0.09)"
      }}
      aria-label="Main navigation bar"
    >
      <div className="flex items-center gap-6">
        {location.pathname !== "/home" && (
          <Link to="/home" className="text-lg font-extrabold hover:underline tracking-tight" style={{color: "var(--accent, #a7c7e7)", display: 'flex', alignItems: 'center'}}>
            <span style={{fontSize: 22, fontWeight: 900, marginRight: 4, color: "var(--accent, #a7c7e7)"}} aria-label="Back to Home">&#8592;</span> Home
          </Link>
        )}
        <NavLink
          to="/accounts"
          title="Test Account Data Archive"
          className={({ isActive }) =>
            (isActive
              ? "font-bold underline underline-offset-8"
              : "hover:text-[#a7c7e7] font-semibold transition-all duration-150") +
            " px-4 py-2 rounded-xl"
          }
          style={({ isActive }) => ({ color: isActive ? "var(--accent, #a7c7e7)" : "var(--primary-text, #232946)" })}
        >
          T.A.D.A.
        </NavLink>
      </div> 
      <div className="flex items-center gap-4">
                {token ? (
          <>
            <span className="mr-4" style={{color: "var(--primary-text, #232946)", opacity: 0.8}}>{user ? user.sub : "User"}</span>
            <button onClick={handleLogout} className="px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition-all" style={{background: "var(--accent, #a7c7e7)", color: "#232946"}}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition-all" style={{background: "var(--accent, #a7c7e7)", color: "#232946"}}>Login</Link>
        )}
      </div>
    </nav>
  );
}

