import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import Signup from '../pages/Signup';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';

// Mock the axios module
vi.mock('../api/axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderSignup = () => {
  return render(
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
};

describe('Signup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.getItem.mockReturnValue(null);
  });

  // Test 1: Renders signup form with all fields
  test('renders signup form with all required fields', () => {
    renderSignup();
    
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  // Test 2: Shows validation error for empty full name
  test('shows validation error when full name is empty', async () => {
    renderSignup();
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
    });
  });

  // Test 3: Shows validation error when password is empty
  test('shows password required error when password is not filled', async () => {
    renderSignup();
    
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    
    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  // Test 4: Shows validation error for weak password (no uppercase)
  test('shows validation error for password without uppercase letter', async () => {
    renderSignup();
    
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    
    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInput, 'password123');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/password must contain at least one uppercase letter/i)).toBeInTheDocument();
    });
  });

  // Test 5: Shows validation error when passwords don't match
  test('shows validation error when passwords do not match', async () => {
    renderSignup();
    
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInput, 'Password123');
    await userEvent.type(confirmPasswordInput, 'Password456');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  // Test 6: Link to login page exists
  test('has link to login page', () => {
    renderSignup();
    
    const loginLink = screen.getByRole('link', { name: /sign in/i });
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});
