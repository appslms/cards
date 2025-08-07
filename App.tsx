
import React from 'react';
import { VirtualCard } from './components/VirtualCard';

function App() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-900 text-white p-4 overflow-hidden">
      <div className="w-full max-w-md mx-auto text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 sm:text-5xl">Holographic Card FX</h1>
          <p className="mt-4 text-lg text-gray-300">Move your mouse over the card or tilt your phone to see the magic.</p>
      </div>
      <VirtualCard />
    </main>
  );
}

export default App;
