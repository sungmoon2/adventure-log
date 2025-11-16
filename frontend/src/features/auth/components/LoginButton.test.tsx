import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginButton } from './LoginButton';

// Mock useAuth hook
const mockSignIn = vi.fn();
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    loading: false,
    user: null,
    signOut: vi.fn(),
    isAuthenticated: false,
  }),
}));

describe('LoginButton', () => {
  it('should render login button', () => {
    render(<LoginButton />);

    const button = screen.getByRole('button', { name: /sign in with google/i });
    expect(button).toBeInTheDocument();
  });

  it('should call signIn when clicked', async () => {
    const user = userEvent.setup();
    render(<LoginButton />);

    const button = screen.getByRole('button', { name: /sign in with google/i });
    await user.click(button);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledOnce();
    });
  });

  it('should display loading state during sign in', async () => {
    const user = userEvent.setup();

    // Make signIn take some time
    mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<LoginButton />);

    const button = screen.getByRole('button', { name: /sign in with google/i });
    await user.click(button);

    // Check for loading indicator
    expect(button).toBeDisabled();
  });

  it('should handle sign in error gracefully', async () => {
    const user = userEvent.setup();

    // Make signIn reject
    mockSignIn.mockRejectedValueOnce(new Error('Sign in failed'));

    render(<LoginButton />);

    const button = screen.getByRole('button', { name: /sign in with google/i });
    await user.click(button);

    // Button should be enabled again after error
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});
