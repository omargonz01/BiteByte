import React from 'react';

const MacroBreakdown = ({ carbs, protein, fat }) => {
    return (
      <div className="bg-white shadow rounded-md py-6 my-4 mx-4">
        <div className="flex justify-around">
          <div className="text-center">
            <span className="text-sm text-gray-700">Carbs</span>
            <div className="text-lg font-semibold">{carbs}g</div>
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-700">Protein</span>
            <div className="text-lg font-semibold">{protein}g</div>
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-700">Fat</span>
            <div className="text-lg font-semibold">{fat}g</div>
          </div>
        </div>
      </div>
    );
  };
  

export default MacroBreakdown;
