import { createContext, useState, useEffect, useContext } from 'react';

import { API_BASE_URL } from '../utils/config';
import { authFetch } from '../utils/auth';

const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    APP_NAME: 'The Vault',
    HEADER_COLOR: 'bg-start',
  });
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/config`);
      if (response.ok) {
        const data = await response.json();
        setConfig((prev) => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Failed to fetch system config:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (key, value) => {
    try {
      const response = await authFetch(`${API_BASE_URL}/api/config`, {
        method: 'POST',
        body: JSON.stringify({ key, value }),
      });
      if (response.ok) {
        setConfig((prev) => ({ ...prev, [key]: value }));
        return true;
      }
    } catch (error) {
      console.error('Failed to update system config:', error);
    }
    return false;
  };

  const hexToRgb = (hex) => {
    if (!hex || typeof hex !== 'string') return null;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
      : null;
  };

  useEffect(() => {
    const root = document.documentElement;
    if (config.THEME_PRIMARY) root.style.setProperty('--primary', hexToRgb(config.THEME_PRIMARY));
    if (config.THEME_SECONDARY)
      root.style.setProperty('--secondary', hexToRgb(config.THEME_SECONDARY));
    if (config.THEME_SURFACE) root.style.setProperty('--surface', hexToRgb(config.THEME_SURFACE));
    if (config.THEME_BG_START)
      root.style.setProperty('--bg-start', hexToRgb(config.THEME_BG_START));
    if (config.THEME_BG_MID) root.style.setProperty('--bg-mid', hexToRgb(config.THEME_BG_MID));
    if (config.THEME_BG_END) root.style.setProperty('--bg-end', hexToRgb(config.THEME_BG_END));
  }, [
    config.THEME_PRIMARY,
    config.THEME_SECONDARY,
    config.THEME_SURFACE,
    config.THEME_BG_START,
    config.THEME_BG_MID,
    config.THEME_BG_END,
  ]);

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, updateConfig, loading, fetchConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};
