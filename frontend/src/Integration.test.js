import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AccountsPage from './pages/AccountsPage';
import DevicesPage from './pages/DevicesPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import { ToastProvider } from './context/ToastContext';
import { ConfigProvider } from './context/ConfigContext';

// Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
    })
);

// Mock authFetch
jest.mock('./utils/auth', () => ({
    authFetch: jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
        })
    ),
    getRole: jest.fn(() => ['ROLE_ADMIN']),
    getCurrentUser: jest.fn(() => ({ username: 'admin' })),
}));

const renderWithRouter = (ui) => {
    return render(
        <ConfigProvider>
            <ToastProvider>
                <MemoryRouter>
                    {ui}
                </MemoryRouter>
            </ToastProvider>
        </ConfigProvider>
    );
};

describe('The Vault Integration Tests', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('Landing Page renders all main tiles', () => {
        // Mock admin token for this test
        const validTokenPart = 'eyJyb2xlIjoiQURNSU4ifQ=='; // {"role":"ADMIN"}
        const token = `header.${validTokenPart}.signature`;
        Storage.prototype.getItem = jest.fn(() => token);

        renderWithRouter(<LandingPage />);
        expect(screen.getByText(/Choose what you want to access/i)).toBeInTheDocument();

        // Use getAllByText because T.A.D.A. and D.H.Q. appear in both the header and the tiles
        expect(screen.getAllByText(/T.A.D.A./i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/D.H.Q./i).length).toBeGreaterThan(0);

        // Admin Settings tile has text "Settings" and "Admin Configuration".
        // "Admin Settings" is only in aria-label.
        expect(screen.getByText(/Admin Configuration/i)).toBeInTheDocument();
        expect(screen.getByText(/Admin Configuration/i)).toBeInTheDocument();
        expect(screen.getByText(/Admin Configuration/i)).toBeInTheDocument();
    });

    test('Accounts Page (T.A.D.A) shows options', async () => {
        renderWithRouter(<AccountsPage />);

        // Check Header - use getAllByText in case of multiple matches (e.g. h2 and span)
        const headers = screen.getAllByText(/Credentials Repository/i);
        expect(headers.length).toBeGreaterThan(0);

        // Check Buttons
        expect(screen.getByRole('button', { name: /\+ Add New Account/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Download Excel/i })).toBeInTheDocument();

        // Check Search
        expect(screen.getByPlaceholderText(/Search by username/i)).toBeInTheDocument();
    });



    test('Admin Settings shows options', async () => {
        renderWithRouter(<AdminSettingsPage />);

        // Check Header
        expect(screen.getByText(/Admin Settings/i)).toBeInTheDocument();

        // Check Environment Section
        expect(screen.getByText(/^Environments$/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/New Environment/i)).toBeInTheDocument();

        // Check Role Section
        expect(screen.getByText(/^Roles$/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/New Role/i)).toBeInTheDocument();

        // Check Buttons exist
        const addButtons = screen.getAllByText(/Add/i);
        expect(addButtons.length).toBeGreaterThan(0);
    });
});
