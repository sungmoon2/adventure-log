import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProfile } from './UserProfile';

// Mock user data
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  aud: 'authenticated' as const,
  role: 'authenticated' as const,
  app_metadata: {},
  user_metadata: {},
  created_at: new Date().toISOString(),
};

// Mock useAuth hook
const mockSignOut = vi.fn();
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    loading: false,
    signIn: vi.fn(),
    signOut: mockSignOut,
    isAuthenticated: true,
  }),
}));

describe('UserProfile', () => {
  it('should display user email', () => {
    render(<UserProfile />);

    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  it('should render sign out button', () => {
    render(<UserProfile />);

    const button = screen.getByRole('button', { name: /sign out/i });
    expect(button).toBeInTheDocument();
  });

  it('should call signOut when sign out button clicked', async () => {
    const user = userEvent.setup();
    render(<UserProfile />);

    const button = screen.getByRole('button', { name: /sign out/i });
    await user.click(button);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledOnce();
    });
  });

  it('should display loading state during sign out', async () => {
    const user = userEvent.setup();

    // Make signOut take some time
    mockSignOut.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<UserProfile />);

    const button = screen.getByRole('button', { name: /sign out/i });
    await user.click(button);

    // Check for loading indicator
    expect(button).toBeDisabled();
  });

  it('should handle sign out error gracefully', async () => {
    const user = userEvent.setup();

    // Make signOut reject
    mockSignOut.mockRejectedValueOnce(new Error('Sign out failed'));

    render(<UserProfile />);

    const button = screen.getByRole('button', { name: /sign out/i });
    await user.click(button);

    // Button should be enabled again after error
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});
