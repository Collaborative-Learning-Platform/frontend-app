import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom'; // Import custom matchers
import { MemoryRouter } from 'react-router-dom';
import SignInPage from '../src/pages/signIn/SignInPage';
import { useAuth } from '../src/contexts/Authcontext';
import axiosInstance from '../src/api/axiosInstance';

// Mock dependencies
vi.mock('../../api/axiosInstance');
vi.mock('../../contexts/Authcontext', () => ({
  useAuth: vi.fn(),
}));
vi.mock('react-router-dom', async (importOriginal: any) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('SignInPage', () => {
  const mockSetAuth = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      setAuth: mockSetAuth,
    });
    vi.clearAllMocks();
  });

  it('renders the form fields correctly', () => {
    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('shows an error for invalid email', async () => {
    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalidemail' },
    });
    fireEvent.blur(screen.getByLabelText(/email/i));

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email/i)
      ).toBeInTheDocument();
    });
  });

  it('calls axios and setAuth on successful login', async () => {
    (axiosInstance.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: {
        success: true,
        user_id: '123',
        role: 'user',
        firstTimeLogin: false,
      },
    });

    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockSetAuth).toHaveBeenCalledWith('123', 'user');
      expect(screen.getByText(/login successful/i)).toBeInTheDocument();
    });
  });

  it('shows server error message on failed login', async () => {
    (axiosInstance.post as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
      response: { status: 500 },
    });

    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });
  });

  it('toggles password visibility when icon is clicked', () => {
    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>
    );

    const passwordField = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByRole('button', { name: '' }); // IconButton

    expect(passwordField).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordField).toHaveAttribute('type', 'text');
  });
});
