import React from 'react';

const NutritionGuide = ({ imageUrl, comingSoon }) => {
    return (
      <div className="relative mx-4 my-4">
        <img className="rounded-md w-full" src={imageUrl} alt="Guide" />
        {comingSoon && (
          <div className="absolute top-4 right-4 bg-green-500 text-white py-1 px-3 rounded-full text-xs">
            Coming Soon
          </div>
        )}
      </div>
    );
  };
  

export default NutritionGuide;
