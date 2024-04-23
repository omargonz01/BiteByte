import React from 'react';
import smallLogo from '../../assets/Images/smallLogo.png';

const Header = () => {
    return (
      <header className="bg-white text-gray-900 shadow-md py-4">
        <div className="max-w-screen-lg mx-auto px-4 flex justify-between items-center">
        
          <img src={smallLogo} alt="bitebyte logo" className="w-24 h-auto mx-auto" />
         
        </div>
      </header>
    );
  };
  

export default Header;