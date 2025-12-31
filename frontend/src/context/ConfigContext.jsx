import { createContext, useState, useEffect, useContext } from 'react';

import { API_BASE_URL } from '../utils/config';
import { authFetch } from '../utils/auth';

const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider = ({ children }) => {
    const [config, setConfig] = useState({
        APP_NAME: 'The Vault',
        HEADER_COLOR: '#1e2337'
    });
    const [loading, setLoading] = useState(true);

    const fetchConfig = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/config`);
            if (response.ok) {
                const data = await response.json();
                setConfig(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error("Failed to fetch system config:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateConfig = async (key, value) => {
        try {
            const response = await authFetch(`${API_BASE_URL}/api/config`, {
                method: 'POST',
                body: JSON.stringify({ key, value })
            });
            if (response.ok) {
                setConfig(prev => ({ ...prev, [key]: value }));
                return true;
            }
        } catch (error) {
            console.error("Failed to update system config:", error);
        }
        return false;
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    return (
        <ConfigContext.Provider value={{ config, updateConfig, loading, fetchConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};
