import { vi } from 'vitest';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

export const mockUser: User = {
  id: 'test-user-id',
  email: 'test@example.com',
  aud: 'authenticated',
  role: 'authenticated',
  app_metadata: {},
  user_metadata: {},
  created_at: new Date().toISOString(),
};

export const mockSession: Session = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: mockUser,
};

export const createMockSupabaseClient = () => {
  const authStateChangeCallbacks = new Map<string, (event: AuthChangeEvent, session: Session | null) => void>();

  return {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signInWithOAuth: vi.fn().mockResolvedValue({ data: { url: 'mock-url' }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn((callback) => {
        const id = Math.random().toString();
        authStateChangeCallbacks.set(id, callback);
        return {
          data: {
            subscription: {
              id,
              unsubscribe: vi.fn(() => {
                authStateChangeCallbacks.delete(id);
              }),
            },
          },
        };
      }),
      // Helper method to trigger auth state change in tests
      _triggerAuthStateChange: (event: AuthChangeEvent, session: Session | null) => {
        authStateChangeCallbacks.forEach((callback) => {
          callback(event, session);
        });
      },
    },
  };
};

export type MockSupabaseClient = ReturnType<typeof createMockSupabaseClient>;
