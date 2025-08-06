
import { useState, useEffect } from 'react';
import { DeviceOrientationState } from '../types';

export const useDeviceOrientation = (enabled: boolean): DeviceOrientationState => {
  const [orientation, setOrientation] = useState<DeviceOrientationState>({
    alpha: null,
    beta: null,
    gamma: null,
  });

  useEffect(() => {
    if (!enabled) {
      setOrientation({ alpha: null, beta: null, gamma: null });
      return;
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
      });
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [enabled]);

  return orientation;
};
