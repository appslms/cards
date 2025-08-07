import React from 'react';
import { useCardRotation } from '../hooks/useCardRotation';
import { MAX_ROTATION_X, MAX_ROTATION_Y } from '../constants';

const cardWidth = 350;
const cardHeight = 600;

export const VirtualCard = () => {
  const { rotation, handleMouseMove, handleMouseLeave, requestDeviceOrientationPermission, isGyroActive } = useCardRotation();

  const glareX = (rotation.y / MAX_ROTATION_Y) * 100 + 50;
  const glareY = (-rotation.x / MAX_ROTATION_X) * 100 + 50;
  
  const holoX = 50 - (rotation.y / MAX_ROTATION_Y) * 20;
  const holoY = 50 - (-rotation.x / MAX_ROTATION_X) * 20;

  const cardStyle: React.CSSProperties = {
    width: `${cardWidth}px`,
    height: `${cardHeight}px`,
    transform: `perspective(1500px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
  };

  const holoStyle: React.CSSProperties = {
    backgroundImage: `conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a33cf3 70deg, #f05285 130deg, #f7d268 200deg, #81f7ab 270deg, #2a8af6 360deg)`,
    backgroundPosition: `${holoX}% ${holoY}%`,
    backgroundSize: '200% 200%',
  };

  const glareStyle: React.CSSProperties = {
    background: `radial-gradient(circle at ${glareX}% ${glareY}%, hsla(0,0%,100%,0.4) 0%, hsla(0,0%,100%,0) 50%)`,
  };

  // Use the provided mask.png for the holographic effect
  const maskStyle: React.CSSProperties = {
    maskImage: `url(/assets/mask.png)`,
    WebkitMaskImage: `url(/assets/mask.png)`,
    maskSize: 'cover',
    WebkitMaskSize: 'cover',
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div 
        className="relative rounded-3xl transition-transform duration-100 ease-out"
        style={cardStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-full h-full transform-style-preserve-3d rounded-3xl overflow-hidden shadow-2xl shadow-black/60">
          
          {/* Layer 1: Card Artwork */}
          <img 
            src="/assets/card.png"
            alt="Virtual Card" 
            className="absolute inset-0 w-full h-full object-cover rounded-3xl"
          />

          {/* Layer 2: Holographic Effect Layer */}
          <div 
            className="absolute inset-0 opacity-80 mix-blend-color-dodge" 
            style={{ ...holoStyle, ...maskStyle }}
          />

          {/* Layer 3: Glare Effect */}
          <div className="absolute inset-0 mix-blend-overlay" style={glareStyle} />

        </div>
      </div>
      {!isGyroActive && (
        <button 
          onClick={requestDeviceOrientationPermission} 
          className="mt-4 px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-semibold backdrop-blur-sm hover:bg-white/20 transition-colors duration-200"
        >
          Enable Gyroscope Control
        </button>
      )}
    </div>
  );
};
