'use client';

import { useEffect, useState } from 'react';
import { AdvancedCursor } from './cursor';

interface AdvancedCursorWrapperProps {
  disabled?: boolean;
}

export default function AdvancedCursorWrapper({ disabled = false }: AdvancedCursorWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <AdvancedCursor disabled={disabled} />;
}
