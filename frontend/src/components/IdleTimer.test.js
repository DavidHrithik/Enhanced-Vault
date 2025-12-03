import React from 'react';
import { render, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import IdleTimer from './IdleTimer';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('IdleTimer', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        mockNavigate.mockClear();
        localStorage.clear();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('logs out after inactivity', () => {
        localStorage.setItem('token', 'fake-token');
        render(
            <MemoryRouter>
                <IdleTimer />
            </MemoryRouter>
        );

        // Fast-forward time
        act(() => {
            jest.advanceTimersByTime(5 * 60 * 1000);
        });

        expect(mockNavigate).toHaveBeenCalledWith('/login');
        expect(localStorage.getItem('token')).toBeNull();
    });

    test('resets timer on activity', () => {
        localStorage.setItem('token', 'fake-token');
        render(
            <MemoryRouter>
                <IdleTimer />
            </MemoryRouter>
        );

        // Advance time partially
        act(() => {
            jest.advanceTimersByTime(4 * 60 * 1000);
        });

        // Simulate activity
        act(() => {
            window.dispatchEvent(new Event('mousemove'));
        });

        // Advance time again (should not timeout yet if reset)
        act(() => {
            jest.advanceTimersByTime(2 * 60 * 1000); // Total 6 mins, but reset at 4
        });

        // Should NOT have logged out yet (only 2 mins since reset)
        expect(mockNavigate).not.toHaveBeenCalled();

        // Advance remaining time
        act(() => {
            jest.advanceTimersByTime(3 * 60 * 1000); // 2 + 3 = 5 mins since reset
        });

        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
});
