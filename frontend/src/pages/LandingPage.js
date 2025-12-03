import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import UserStatus from "../components/UserStatus";
import Loader from "../components/Loader";
import { useConfig } from "../context/ConfigContext";

import AnimatedBackground from "../components/AnimatedBackground";

const tileVariants = {
  hover: { scale: 1.05, boxShadow: "0 6px 30px 0 rgba(16, 185, 129, 0.25)" },
  tap: { scale: 0.98 },
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { config } = useConfig();

  const focusableElements = useRef([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        navigate(-1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);



  const handleFocus = (event) => {
    const element = event.target;
    const index = focusableElements.current.indexOf(element);

    if (index !== -1) {
      focusableElements.current.splice(index, 1);
    }
  };

  const handleBlur = (event) => {
    const element = event.target;
    focusableElements.current.push(element);
  };

  return (
    <>
      <div
        className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#1e2337] via-[#232946] to-[#15161c] relative overflow-hidden"
        aria-label="Landing page"
      >
        <UserStatus />
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute w-[120vw] h-[120vw] left-1/2 top-[-40vw] -translate-x-1/2 bg-gradient-to-tr from-[#a7c7e7]/30 via-[#5f5aa2]/20 to-[#232946]/0 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <AnimatedBackground />
        <main className="relative z-10 flex flex-col items-center justify-center px-4 min-h-screen w-full">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-xl text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#a7c7e7] via-[#5f5aa2] to-[#7ea4c7] animate-gradient">
              Choose what you want to access
            </span>
          </h1>
          <p className="text-4xl md:text-5xl font-extrabold text-cyan-200 mb-10 text-center max-w-2xl tracking-wider">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-cyan-400 to-blue-600 animate-gradient">
              {config.APP_NAME || "The Vault"}
            </span>
          </p>
          <div className="flex flex-wrap gap-12 mt-8 justify-center">
            {/* T.A.D.A. Tile */}
            <motion.div
              whileHover={{ scale: 1.04, rotate: -8, boxShadow: '0 8px 32px 0 rgba(93, 188, 252, 0.18)', background: 'rgba(40,60,90,0.22)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="w-72 h-60 bg-[rgba(40,60,90,0.16)] backdrop-blur-xl border border-[#a7c7e7]/30 shadow-xl rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:border-[#a7c7e7]/60 focus:outline-none"
              style={{ marginRight: 24, WebkitBackdropFilter: 'blur(16px)', backdropFilter: 'blur(16px)' }}
              tabIndex={0}
              onFocus={handleFocus}
              onBlur={handleBlur}
              aria-label="T.A.D.A. tile"
            >
              <Link to="/accounts" className="flex flex-col items-center justify-center w-full h-full focus:outline-none">
                <motion.svg
                  width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
                  className="mb-4"
                  initial={{ y: 0 }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  whileHover={{ scale: 1.18, rotate: 8, filter: 'drop-shadow(0 0 12px #a7c7e7)' }}
                >
                  <motion.rect x="18" y="8" width="28" height="48" rx="8" fill="#a7c7e7" stroke="#232946" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7 }} />
                  <motion.rect x="24" y="14" width="16" height="28" rx="5" fill="#5f5aa2" stroke="#232946" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9 }} />
                  <motion.circle cx="32" cy="44" r="4" fill="#232946" initial={{ scale: 0.7 }} animate={{ scale: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }} />
                  <motion.line x1="32" y1="14" x2="32" y2="34" stroke="#fff" strokeWidth="2" strokeDasharray="2 2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
                </motion.svg>
                <span className="text-2xl font-extrabold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-[#a7c7e7] via-[#5f5aa2] to-[#7ea4c7] animate-gradient">
                  {config.TADA_TILE_NAME || "T.A.D.A."}
                </span>
                <span className="text-base font-semibold text-cyan-200 mb-2">
                  Test Account Data Archive
                </span>
              </Link>
            </motion.div>

            {/* Devices Tile */}
            <motion.div
              whileHover={{ scale: 1.04, rotate: 8, boxShadow: '0 8px 32px 0 rgba(93, 252, 188, 0.18)', background: 'rgba(40,60,90,0.22)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="w-72 h-60 bg-[rgba(40,60,90,0.16)] backdrop-blur-xl border border-[#5fd7b7]/30 shadow-xl rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:border-[#5fd7b7]/60 focus:outline-none"
              tabIndex={0}
              onFocus={handleFocus}
              onBlur={handleBlur}
              aria-label="Devices tile"
              style={{ WebkitBackdropFilter: 'blur(16px)', backdropFilter: 'blur(16px)' }}
            >
              <Link to="/devices" className="flex flex-col items-center justify-center w-full h-full focus:outline-none">
                <motion.svg
                  width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
                  className="mb-4"
                  initial={{ scale: 1 }}
                  animate={{
                    scale: [1, 1.08, 1],
                    filter: [
                      'drop-shadow(0 0 0px #5fd7b7)',
                      'drop-shadow(0 0 16px #5fd7b7)',
                      'drop-shadow(0 0 0px #5fd7b7)'
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  whileHover={{ scale: 1.18, rotate: 0, filter: 'drop-shadow(0 0 24px #5fd7b7)' }}
                >
                  <rect x="12" y="16" width="40" height="32" rx="8" fill="#5fd7b7" stroke="#232946" strokeWidth="3" />
                  <rect x="20" y="24" width="24" height="16" rx="4" fill="#232946" stroke="#5fd7b7" strokeWidth="2" />
                  <circle cx="32" cy="48" r="3" fill="#fff" >
                    <animate attributeName="r" values="3;6;3" dur="2.2s" repeatCount="indefinite" />
                  </circle>
                  <rect x="30" y="20" width="4" height="4" rx="1" fill="#a7c7e7" />
                  <motion.rect x="16" y="36" width="32" height="4" rx="2" fill="#a7c7e7" initial={{ opacity: 0.4 }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut', delay: 1 }} />
                </motion.svg>
                <span className="text-2xl font-extrabold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-[#5fd7b7] via-[#a7c7e7] to-[#5f5aa2] animate-gradient">
                  {config.DHQ_TILE_NAME || "D.H.Q."}
                </span>
                <span className="text-base font-semibold text-green-200 mb-2">Device Head Quarters</span>
              </Link>
            </motion.div>

            {/* Admin Settings Tile */}
            {(() => {
              try {
                const token = localStorage.getItem('token');
                if (token) {
                  const payload = JSON.parse(atob(token.split('.')[1]));
                  const role = payload.role || payload.ROLE || payload.roles || payload.authorities || (payload.sub === 'admin' ? 'ADMIN' : 'USER');
                  if (role === 'ADMIN') {
                    return (
                      <motion.div
                        whileHover={{ scale: 1.04, rotate: -8, boxShadow: '0 8px 32px 0 rgba(255, 99, 132, 0.18)', background: 'rgba(40,60,90,0.22)' }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                        className="w-72 h-60 bg-[rgba(40,60,90,0.16)] backdrop-blur-xl border border-pink-400/30 shadow-xl rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:border-pink-400/60 focus:outline-none"
                        tabIndex={0}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        aria-label="Admin Settings tile"
                        style={{ marginLeft: 24, WebkitBackdropFilter: 'blur(16px)', backdropFilter: 'blur(16px)' }}
                      >
                        <Link to="/admin/settings" className="flex flex-col items-center justify-center w-full h-full focus:outline-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-2xl font-extrabold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-red-400 to-orange-400 animate-gradient">
                            Settings
                          </span>
                          <span className="text-base font-semibold text-pink-200 mb-2">
                            Admin Configuration
                          </span>
                        </Link>
                      </motion.div>
                    );
                  }
                }
              } catch (e) {
                console.error("Error parsing token", e);
              }
              return null;
            })()}
          </div>
        </main >
      </div >

    </>
  );
}
