import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function LoginButton() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn();
    } catch (error) {
      console.error('Failed to sign in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? 'Signing in...' : 'Sign in with Google'}
    </button>
  );
}
