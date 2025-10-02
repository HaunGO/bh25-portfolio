'use client';

import { useEffect, useState } from 'react';
import { AdvancedCursor } from './cursor';

export default function AdvancedCursorWrapper() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <AdvancedCursor />;
}
