'use client';

import { useEffect, useState } from 'react';

/**
 * ClientOnly component ensures children are only rendered on the client side
 * This prevents hydration mismatches when content differs between server and client
 */
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return <>{children}</>;
}
