import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const IdleTimer = () => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const TIMEOUT_DURATION = 5 * 60 * 1000; // 5 minutes

  const { showToast } = useToast();

  const logout = () => {
    localStorage.removeItem('token');
    showToast('Logged out due to inactivity for security.', 'error');
    navigate('/login');
  };

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (localStorage.getItem('token')) {
      timeoutRef.current = setTimeout(logout, TIMEOUT_DURATION);
    }
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];

    const handleEvent = () => {
      resetTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleEvent);
    });

    // Initial timer start
    resetTimer();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleEvent);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]); // Re-run if navigate changes (unlikely) or on mount

  return null; // This component doesn't render anything
};

export default IdleTimer;
