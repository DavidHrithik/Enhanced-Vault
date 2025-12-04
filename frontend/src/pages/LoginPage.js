import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import QuoteWidget from '../components/QuoteWidget';

import { useConfig } from "../context/ConfigContext";

import { API_BASE_URL } from "../utils/config";

const LoginPage = () => {
  const { config } = useConfig();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  // Redirect to /home if already logged in and not on /login
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && window.location.pathname === '/login') {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cleanBaseUrl = API_BASE_URL.replace(/\/+$/, '');
      const response = await fetch(`${cleanBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { error: text || 'Login failed' };
      }

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        navigate('/home');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error("Login error details:", err);
      setError('Network error: ' + err.message);
    }
    setLoading(false);
  };


  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#15161c]/90 via-[#232946]/95 to-[#1e2337]/90 relative overflow-hidden border border-[#232946]/60 shadow-2xl backdrop-blur-xl">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute w-[120vw] h-[120vw] left-1/2 top-[-40vw] -translate-x-1/2 bg-gradient-to-tr from-[#a7c7e7]/30 via-[#5f5aa2]/20 to-[#232946]/0 rounded-full blur-3xl animate-pulse"></div>
      </div>
      <AnimatedBackground />
      <main className="relative z-10 flex flex-col items-center justify-center px-4 min-h-screen w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-2xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#a7c7e7] via-[#5f5aa2] to-[#7ea4c7] animate-gradient">
              {config.APP_NAME || "The Vault"}
            </span>
          </h1>
          <p className="text-lg text-cyan-200/80 font-medium tracking-wide">
            Secure Access Portal
          </p>
        </div>
        <div className="w-full max-w-md bg-[#232946]/40 backdrop-blur-3xl border border-[#a7c7e7]/20 shadow-md rounded-3xl p-8 flex flex-col items-center" style={{ boxShadow: '0 4px 16px 0 rgba(34, 41, 70, 0.15)', background: 'linear-gradient(120deg, rgba(35,41,70,0.20) 40%, rgba(23,22,28,0.12) 100%)' }}>
          <h2 className="text-3xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#a7c7e7] via-[#5f5aa2] to-[#7ea4c7] animate-gradient text-center drop-shadow-lg">Sign in to your account</h2>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div>
              <label className="block text-white/80 font-semibold mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-xl bg-[#15161c]/70 border border-[#a7c7e7]/20 text-white focus:outline-none focus:ring-2 focus:ring-[#a7c7e7] placeholder:text-white/40"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-white/80 font-semibold mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-xl bg-[#15161c]/70 border border-[#a7c7e7]/20 text-white focus:outline-none focus:ring-2 focus:ring-[#a7c7e7] placeholder:text-white/40"
                placeholder="Enter your password"
              />
            </div>
            {error && <div className="text-red-300 font-semibold text-center">{error}</div>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#232946] via-[#5f5aa2] to-[#15161c] text-[#a7c7e7] font-bold py-2 rounded-xl shadow-lg hover:from-[#5f5aa2] hover:to-[#a7c7e7] hover:text-white transition-all duration-200 disabled:opacity-60 border border-[#a7c7e7]/30"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </main>
      <QuoteWidget />
    </div>
  );
};

export default LoginPage;
