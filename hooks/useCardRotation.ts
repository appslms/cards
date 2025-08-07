
import React, { useState, useCallback } from 'react';
import { MAX_ROTATION_X, MAX_ROTATION_Y } from '../constants';

export const useCardRotation = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isGyroActive, setIsGyroActive] = useState(false);

  const handleDeviceOrientation = useCallback((event: DeviceOrientationEvent) => {
    const { beta, gamma } = event; // beta: front-back tilt, gamma: left-right tilt
    if (beta === null || gamma === null) return;
    
    // Clamp values to avoid extreme rotations
    const rotateX = Math.min(Math.max(beta, -MAX_ROTATION_X * 1.5), MAX_ROTATION_X * 1.5);
    const rotateY = Math.min(Math.max(gamma, -MAX_ROTATION_Y * 1.5), MAX_ROTATION_Y * 1.5);

    setRotation({ x: rotateX, y: rotateY });
  }, []);

  const requestDeviceOrientationPermission = useCallback(async () => {
    if ('DeviceOrientationEvent' in window && typeof (window.DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (window.DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', handleDeviceOrientation);
          setIsGyroActive(true);
        }
      } catch (error) {
        console.error("Device orientation permission request failed:", error);
      }
    } else if ('DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
      setIsGyroActive(true);
    } else {
        alert("Gyroscope control is not supported on your device/browser.");
    }
  }, [handleDeviceOrientation]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isGyroActive) return; 
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    
    const rotateY = MAX_ROTATION_Y * (x / width - 0.5);
    const rotateX = -MAX_ROTATION_X * (y / height - 0.5);

    setRotation({ x: rotateX, y: rotateY });
  }, [isGyroActive]);
  
  const handleMouseLeave = useCallback(() => {
    if (isGyroActive) return;
    setRotation({ x: 0, y: 0 });
  }, [isGyroActive]);

  return { rotation, handleMouseMove, handleMouseLeave, requestDeviceOrientationPermission, isGyroActive };
};
