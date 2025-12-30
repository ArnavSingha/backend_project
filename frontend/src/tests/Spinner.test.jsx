import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Spinner from '../components/Spinner';

describe('Spinner Component', () => {
  // Test 1: Renders spinner with default size
  test('renders spinner with default medium size', () => {
    render(<Spinner />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('w-8', 'h-8');
  });

  // Test 2: Renders spinner with small size
  test('renders spinner with small size', () => {
    render(<Spinner size="sm" />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toHaveClass('w-4', 'h-4');
  });

  // Test 3: Renders spinner with large size
  test('renders spinner with large size', () => {
    render(<Spinner size="lg" />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toHaveClass('w-12', 'h-12');
  });

  // Test 4: Applies custom className
  test('applies custom className', () => {
    render(<Spinner className="my-custom-class" />);
    
    const container = document.querySelector('.my-custom-class');
    expect(container).toBeInTheDocument();
  });
});
