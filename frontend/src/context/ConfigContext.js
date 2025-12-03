import React, { createContext, useState, useEffect, useContext } from 'react';

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
            const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
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
            const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
            const response = await fetch(`${API_BASE_URL}/api/config`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
