import React from "react";
import "./MacroBreakdown.css";  // Ensure any additional custom styles are here if needed

const MacroCounter = ({ label, value }) => (
  <div className="text-center py-1 px-4">
    <div className="text-lg font-bold">{value.toFixed(0)}g</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);

const MacroBreakdown = ({ nutrition }) => {
  return (
    <div className="flex flex-col items-center p-4">
      <div className="text-3xl font-bold text-gray-700 mb-1">
        {nutrition.calories ? nutrition.calories.toFixed(0) : '0'}
      </div>
      <div className="text-xl text-gray-600">CALS EATEN</div>

      <div className="text-gray-600 text-md font-semibold mt-20 mb-5">
        MACRO BREAKDOWN V
      </div>

      <div className="bg-white rounded-lg shadow p-2 flex justify-around w-80">
        <MacroCounter
          label="Carbs"
          value={nutrition.carbohydrates ? nutrition.carbohydrates : 0}
        />
        <MacroCounter
          label="Protein"
          value={nutrition.protein ? nutrition.protein : 0}
        />
        <MacroCounter
          label="Fat"
          value={nutrition.fat ? nutrition.fat : 0}
        />
      </div>
    </div>
  );
};

export default MacroBreakdown;
