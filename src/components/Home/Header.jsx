import React from 'react';

const Header = () => {
    return (
      <header className="bg-white text-gray-900 shadow-md py-4">
        <div className="max-w-screen-lg mx-auto px-4 flex justify-between items-center">
          <span> {/* Icon or back button */} </span>
          <h1 className="text-lg font-semibold">bitebyte</h1>
          <span> {/* Placeholder for right-aligned elements */} </span>
        </div>
      </header>
    );
  };
  

export default Header;