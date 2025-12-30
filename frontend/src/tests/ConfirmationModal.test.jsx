import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import ConfirmationModal from '../components/ConfirmationModal';

describe('ConfirmationModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Test Title',
    message: 'Test Message',
    confirmText: 'Confirm',
    isLoading: false,
  };

  // Test 1: Does not render when isOpen is false
  test('does not render when isOpen is false', () => {
    render(<ConfirmationModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  // Test 2: Renders modal with title and message
  test('renders modal with title and message when open', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  // Test 3: Calls onClose when Cancel button is clicked
  test('calls onClose when Cancel button is clicked', () => {
    const onClose = vi.fn();
    render(<ConfirmationModal {...defaultProps} onClose={onClose} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Test 4: Calls onConfirm when Confirm button is clicked
  test('calls onConfirm when Confirm button is clicked', () => {
    const onConfirm = vi.fn();
    render(<ConfirmationModal {...defaultProps} onConfirm={onConfirm} />);
    
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);
    
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  // Test 5: Displays custom confirm text
  test('displays custom confirm button text', () => {
    render(<ConfirmationModal {...defaultProps} confirmText="Delete User" />);
    
    expect(screen.getByRole('button', { name: /delete user/i })).toBeInTheDocument();
  });

  // Test 6: Disables buttons when loading
  test('disables buttons when isLoading is true', () => {
    render(<ConfirmationModal {...defaultProps} isLoading={true} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    
    expect(cancelButton).toBeDisabled();
    expect(confirmButton).toBeDisabled();
  });

  // Test 7: Calls onClose when backdrop is clicked
  test('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<ConfirmationModal {...defaultProps} onClose={onClose} />);
    
    // The backdrop has the bg-black class
    const backdrop = document.querySelector('.bg-black');
    fireEvent.click(backdrop);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
