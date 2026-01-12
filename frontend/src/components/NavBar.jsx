import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = token ? parseJwt(token) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav
      className="w-full flex items-center justify-between px-8 py-3 fixed top-0 left-0 z-30 shadow-lg"
      style={{
        background: 'var(--surface, #fff)',
        color: 'var(--primary-text, #232946)',
        borderBottom: '1.5px solid var(--accent, #a7c7e7)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 2px 24px 0 rgba(30,36,55,0.09)',
      }}
      aria-label="Main navigation bar"
    >
      <div className="hidden md:flex items-center gap-6">
        {location.pathname !== '/home' && (
          <Link
            to="/home"
            className="text-lg font-extrabold hover:underline tracking-tight"
            style={{ color: 'var(--accent, #a7c7e7)', display: 'flex', alignItems: 'center' }}
          >
            <span
              style={{
                fontSize: 22,
                fontWeight: 900,
                marginRight: 4,
                color: 'var(--accent, #a7c7e7)',
              }}
              aria-label="Back to Home"
            >
              &#8592;
            </span>{' '}
            Home
          </Link>
        )}
        <NavLink
          to="/accounts"
          title="Test Account Data Archive"
          className={({ isActive }) =>
            (isActive
              ? 'font-bold underline underline-offset-8'
              : 'hover:text-[#a7c7e7] font-semibold transition-all duration-150') +
            ' px-4 py-2 rounded-xl'
          }
          style={({ isActive }) => ({
            color: isActive ? 'var(--accent, #a7c7e7)' : 'var(--primary-text, #232946)',
          })}
        >
          T.A.D.A.
        </NavLink>
      </div>
      <div className="hidden md:flex items-center gap-4">
        {token ? (
          <>
            <span className="mr-4" style={{ color: 'var(--primary-text, #232946)', opacity: 0.8 }}>
              {user ? user.sub : 'User'}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition-all"
              style={{ background: 'var(--accent, #a7c7e7)', color: '#232946' }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition-all"
            style={{ background: 'var(--accent, #a7c7e7)', color: '#232946' }}
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Hamburger Button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-[#232946] focus:outline-none"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-[#f4f4f9] dark:bg-[#232946] shadow-xl border-t border-[#a7c7e7]/30 flex flex-col p-6 z-40 md:hidden"
          >
            {location.pathname !== '/home' && (
              <Link
                to="/home"
                onClick={() => setIsOpen(false)}
                className="mb-4 text-xl font-bold text-[#232946] dark:text-[#a7c7e7]"
              >
                Home
              </Link>
            )}
            <Link
              to="/accounts"
              onClick={() => setIsOpen(false)}
              className="mb-6 text-xl font-bold text-[#232946] dark:text-[#a7c7e7]"
            >
              T.A.D.A.
            </Link>
            <div className="h-px bg-gray-300 dark:bg-gray-700 w-full mb-6"></div>
            {token ? (
              <div className="flex flex-col gap-4">
                <span className="text-lg text-[#232946] dark:text-white opacity-80">
                  Signed in as {user ? user.sub : 'User'}
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-center py-3 rounded-xl bg-[#a7c7e7] text-[#232946] font-bold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-[#a7c7e7] text-[#232946] font-bold"
              >
                Login
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
