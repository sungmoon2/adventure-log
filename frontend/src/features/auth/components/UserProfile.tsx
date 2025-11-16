import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function UserProfile() {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-gray-700">{user.email}</span>
      <button
        onClick={handleSignOut}
        disabled={isLoading}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Signing out...' : 'Sign out'}
      </button>
    </div>
  );
}
