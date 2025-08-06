
import React, { useState, useCallback } from 'react';
import { VirtualCard } from './components/VirtualCard';
import { useDeviceOrientation } from './hooks/useDeviceOrientation';

const App: React.FC = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const orientation = useDeviceOrientation(permissionGranted);

  const requestPermission = useCallback(async () => {
    // Feature detection for iOS 13+
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          setPermissionGranted(true);
          setError(null);
        } else {
          setError('Permission to access device orientation was denied.');
        }
      } catch (err) {
        if (err instanceof Error) {
            setError(`Error requesting permission: ${err.message}`);
        } else {
            setError('An unknown error occurred while requesting permission.');
        }
      }
    } else {
      // For non-iOS 13+ devices, permission is not required
      setPermissionGranted(true);
      console.log('Device orientation does not require permission on this device.');
    }
  }, []);

  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center p-4 bg-gray-900 font-sans">
      <div className="absolute top-0 left-0 p-6 text-center w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          Gyro-Reactive Card
        </h1>
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
          {permissionGranted 
            ? 'Move your device to see the magic!' 
            : 'Click the button below and allow access to your device\'s motion sensors.'
          }
        </p>
      </div>

      <div className="w-full h-full flex-grow flex items-center justify-center">
        {!permissionGranted ? (
          <div className="text-center">
            <button
              onClick={requestPermission}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold rounded-full shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Enable Motion Effects
            </button>
            {error && <p className="text-red-400 mt-4">{error}</p>}
          </div>
        ) : (
          <VirtualCard orientation={orientation} />
        )}
      </div>

      <footer className="w-full text-center p-4 text-xs text-gray-600">
        Inspired by the pokemon-cards-css project. Best viewed on a mobile device.
      </footer>
    </main>
  );
};

export default App;
