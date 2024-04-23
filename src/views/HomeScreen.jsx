import React from 'react';
import smallLogo from '../assets/smallLogo.png';

const HomeScreen = () => {
  return (
    <div className="bg-white max-w-xs mx-auto overflow-hidden">
      <header className="flex justify-between items-center p-4 border-b">
        <div className="text-sm">9:41</div>
        <img src={smallLogo} />
        <div className="text-sm">TODAY, APR 17</div>
      </header>

      <main className="flex flex-col items-center py-10">
        <div className="mb-6">
          <div className="w-40 h-40 rounded-full border-4 border-green-200 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold">2000</div>
              <div className="text-sm font-semibold">CALS LEFT</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between w-full px-10 mb-6">
          <div className="text-center">
            <div className="font-bold">Carbs</div>
            <div className="text-sm">0 / 215g</div>
          </div>
          <div className="text-center">
            <div className="font-bold">Protein</div>
            <div className="text-sm">0 / 86g</div>
          </div>
          <div className="text-center">
            <div className="font-bold">Fat</div>
            <div className="text-sm">0 / 57g</div>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t text-gray-800">
        <div className="flex justify-between items-center px-4 py-3">
          <a href="/home" className="flex flex-col items-center text-xs">
            <svg /* insert your home icon SVG path data here */ className="w-6 h-6 mb-1" viewBox="0 0 24 24"></svg>
            Home
          </a>
          {/* ... other navigation items ... */}
          <a href="/add" className="flex flex-col items-center text-xs">
            <svg /* insert your add icon SVG path data here */ className="w-6 h-6 mb-1" viewBox="0 0 24 24"></svg>
            Add
          </a>
          {/* ... other navigation items ... */}
        </div>
      </nav>
    </div>
  );
};

export default HomeScreen;
