import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { AuthContextType } from '@/types';

/**
 * Custom hook to access authentication context
 * @returns {AuthContextType} Authentication context value
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default useAuth;
