
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeviceModal from './DeviceModal';
import '@testing-library/jest-dom';

// Mock API_BASE_URL
vi.mock('../utils/config', () => ({
    API_BASE_URL: 'http://localhost:8080'
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>
    },
    AnimatePresence: ({ children }) => <>{children}</>
}));

describe('DeviceModal', () => {
    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([{ id: '1', value: 'Available' }, { id: '2', value: 'In Use' }]),
            })
        );
    });

    test('renders correctly when open', async () => {
        render(<DeviceModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

        // Wait for content to appear (setTimeout in component)
        await waitFor(() => {
            expect(screen.getByText('Add New Device')).toBeInTheDocument();
        });

        expect(screen.getByPlaceholderText('e.g. iPhone 15, Samsung S24')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('e.g. QA Team, John Doe')).toBeInTheDocument();
    });

    test('validates inputs before submission', async () => {
        render(<DeviceModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

        await waitFor(() => {
            expect(screen.getByText('Add New Device')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Add Device'));

        expect(await screen.findByText('Device model required')).toBeInTheDocument();
        expect(await screen.findByText('Owner required')).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('calls onSubmit with form data when valid', async () => {
        mockOnSubmit.mockImplementation((data, callback) => callback());

        render(<DeviceModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

        await waitFor(() => {
            expect(screen.getByText('Add New Device')).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText('e.g. iPhone 15, Samsung S24'), { target: { value: 'Pixel 8' } });
        fireEvent.change(screen.getByPlaceholderText('e.g. QA Team, John Doe'), { target: { value: 'Jane Doe' } });

        // Select status (default is Available, let's keep it or change it if options loaded)
        // Options load async.
        await waitFor(() => expect(screen.getByDisplayValue('Available')).toBeInTheDocument());

        fireEvent.click(screen.getByText('Add Device'));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                model: 'Pixel 8',
                owner: 'Jane Doe',
                status: 'Available'
            }, expect.any(Function));
        });
    });
});
