import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { mockSession, mockUser } from '@/test/mocks/supabase';

// Mock the supabase client
vi.mock('@/lib/supabase', async () => {
  const { createMockSupabaseClient } = await import('@/test/mocks/supabase');
  return {
    supabase: createMockSupabaseClient(),
  };
});

import { useAuth } from './useAuth';
import { supabase as mockSupabaseClient } from '@/lib/supabase';

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
  });

  it('should return null user when not authenticated', async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
  });

  it('should return user when authenticated', async () => {
    // Mock authenticated session
    mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
      data: { session: mockSession },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it('should handle signIn function', async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.signIn();

    expect(mockSupabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: expect.stringContaining('/dashboard'),
      },
    });
  });

  it('should handle signOut function', async () => {
    // Mock authenticated session
    mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
      data: { session: mockSession },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.signOut();

    expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();
  });

  it('should update user on auth state change', async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();

    // Trigger auth state change
    const authStateChangeCallback = mockSupabaseClient.auth.onAuthStateChange.mock.calls[0][0];
    authStateChangeCallback('SIGNED_IN', mockSession);

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('should handle session error gracefully', async () => {
    // Mock error when getting session
    mockSupabaseClient.auth.getSession.mockRejectedValueOnce(new Error('Session error'));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
  });

  it('should throw error on signIn failure', async () => {
    // Mock error when signing in
    mockSupabaseClient.auth.signInWithOAuth.mockResolvedValueOnce({
      data: { url: null },
      error: new Error('Sign in failed'),
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(result.current.signIn()).rejects.toThrow('Sign in failed');
  });

  it('should throw error on signOut failure', async () => {
    // Mock error when signing out
    mockSupabaseClient.auth.signOut.mockResolvedValueOnce({
      error: new Error('Sign out failed'),
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(result.current.signOut()).rejects.toThrow('Sign out failed');
  });
});
