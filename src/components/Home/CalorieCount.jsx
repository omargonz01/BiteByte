import React from 'react';

const CalorieCount = ({ caloriesLeft, caloriesConsumed }) => {
    return (
      <div className="text-center py-8">
        <div className="mx-auto mb-4 w-40 h-40 rounded-full border-4 border-green-500 flex items-center justify-center">
          <span className="text-4xl font-bold text-gray-800">{caloriesLeft}</span>
        </div>
        <div className="text-sm font-medium text-gray-700">{caloriesConsumed} EATEN</div>
      </div>
    );
  };
  

export default CalorieCount;
