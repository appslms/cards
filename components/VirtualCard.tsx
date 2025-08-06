
import React, { useRef, useEffect } from 'react';
import type { DeviceOrientationState } from '../types';

interface VirtualCardProps {
  orientation: DeviceOrientationState;
}

// Utility to map a value from one range to another
const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

// Utility to clamp a number between a min and max
const clamp = (value: number, min: number, max:number): number => {
    return Math.min(Math.max(value, min), max);
}


export const VirtualCard: React.FC<VirtualCardProps> = ({ orientation }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || orientation.beta === null || orientation.gamma === null) {
      return;
    }
    
    const cardElement = cardRef.current;

    // Clamp beta and gamma to a reasonable range to avoid wild rotations
    const clampedBeta = clamp(orientation.beta, -45, 45);
    const clampedGamma = clamp(orientation.gamma, -45, 45);

    // Rotation values
    const rotateX = mapRange(clampedBeta, -45, 45, -15, 15);
    const rotateY = mapRange(clampedGamma, -45, 45, -15, 15);

    // Glare position values
    const glareX = mapRange(clampedGamma, -45, 45, 0, 100);
    const glareY = mapRange(clampedBeta, -45, 45, 0, 100);
    
    // Holographic gradient angle
    const holoAngle = (Date.now() / 10) % 360; // Slow rotation for a shimmering effect

    // Update CSS custom properties
    cardElement.style.setProperty('--rotate-x', `${-rotateX}deg`);
    cardElement.style.setProperty('--rotate-y', `${rotateY}deg`);
    cardElement.style.setProperty('--glare-x', `${glareX}%`);
    cardElement.style.setProperty('--glare-y', `${glareY}%`);
    cardElement.style.setProperty('--holo-angle', `${holoAngle}deg`);

  }, [orientation]);

  return (
    <div className="w-full h-full flex items-center justify-center [perspective:2000px]">
      <div
        ref={cardRef}
        className="relative w-[300px] h-[420px] md:w-[350px] md:h-[490px] rounded-2xl transition-transform duration-100 ease-out [transform-style:preserve-3d]"
        style={{
          transform: 'rotateY(var(--rotate-y, 0)) rotateX(var(--rotate-x, 0))',
        }}
      >
        {/* Card Background & Image */}
        <div
          className="absolute inset-0 rounded-2xl bg-cover bg-center bg-no-repeat shadow-2xl shadow-cyan-500/30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=800&auto=format&fit=crop')" }}
        ></div>

        {/* Holographic Effect Layer */}
        <div
            className="absolute inset-0 rounded-2xl overflow-hidden mix-blend-color-dodge opacity-40 [background:radial-gradient(circle_farthest-corner_at_var(--glare-x)_var(--glare-y),_hsl(var(--holo-angle),100%,75%)_0%,_hsl(var(--holo-angle),100%,25%)_100%)]"
        ></div>
        
        {/* Glare Effect Layer */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden mix-blend-overlay opacity-80 [background:radial-gradient(circle_at_var(--glare-x)_var(--glare-y),_rgba(255,255,255,0.8)_0%,_rgba(255,255,255,0)_50%)]"
        ></div>

        {/* Card Border */}
        <div className="absolute inset-0 border-8 border-gray-300 rounded-2xl"></div>
        
        {/* Card Content (Example) */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white [transform:translateZ(40px)]">
           <h2 className="text-3xl font-bold tracking-wider [text-shadow:0_2px_4px_rgba(0,0,0,0.7)]">COSMIC WANDERER</h2>
           <p className="text-sm opacity-80 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">Rare Edition</p>
        </div>
      </div>
    </div>
  );
};
