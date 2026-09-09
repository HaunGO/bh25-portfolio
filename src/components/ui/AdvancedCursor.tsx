'use client';

import { useEffect, useState } from 'react';
import { AdvancedCursor } from './cursor';
import { useDashboard } from '@/components/dashboard/Dashboard';
import { usePointerMode } from '@/hooks/usePointerMode';

interface AdvancedCursorWrapperProps {
  disabled?: boolean;
}

export default function AdvancedCursorWrapper({ disabled = false }: AdvancedCursorWrapperProps) {
  const [isClient, setIsClient] = useState(false);
  const pointerMode = usePointerMode();
  const { ready, settings } = useDashboard();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const touchTrailOff = ready && pointerMode === 'coarse' && settings.touchTrail === false;

  return (
    <AdvancedCursor
      disabled={disabled || touchTrailOff}
      drawMode={ready && pointerMode === 'coarse' ? settings.drawMode : false}
    />
  );
}
