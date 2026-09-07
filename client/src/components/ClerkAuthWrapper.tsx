import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = (import.meta as any).env?.VITE_CLERK_PUBLISHABLE_KEY;

export const ClerkAuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (PUBLISHABLE_KEY && typeof PUBLISHABLE_KEY === 'string' && PUBLISHABLE_KEY.startsWith('pk_')) {
    return <ClerkProvider publishableKey={PUBLISHABLE_KEY}>{children}</ClerkProvider>;
  }

  // Graceful fallback for local development & hackathon demo when Clerk key is not set
  return <>{children}</>;
};
