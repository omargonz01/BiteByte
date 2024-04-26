import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const dailyValues = {
  carbs: 325,   
  protein: 200, 
  fat: 78       
};

// fixed to ensure exceeding totals does not break the UI
const calculatePercentage = (value, dailyValue) => {
  const percentage = (value / dailyValue) * 100;
  return Math.min(percentage, 100); 
};

const MacroCounter = ({ label, value, percentage }) => (
  <div className="py-2 flex flex-col items-center gap-2">
    <div className="text-center text-neutral-800 text-sm font-normal">{label}</div>
    <div className="w-20 h-2.5 bg-stone-300 rounded-full overflow-hidden">
      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
    </div>
    <div className="text-center text-neutral-800 text-sm font-normal">{value.toFixed(0)}g</div>
  </div>
);

const MacroBreakdown = ({ nutrition }) => {
  // Calculate the percentage of the daily value for each macro
  const carbsPercent = calculatePercentage(nutrition.carbohydrates, dailyValues.carbs);
  const proteinPercent = calculatePercentage(nutrition.protein, dailyValues.protein);
  const fatPercent = calculatePercentage(nutrition.fat, dailyValues.fat);

  // CircularProgressbar styles
  const progressBarStyles = buildStyles({
    pathColor: `rgba(62, 152, 199, ${nutrition.calories / 2000})`,
    textColor: '#4b5563',
    trailColor: '#d6d6d6',
    backgroundColor: '#3e98c7', 
  });

  return (
    <div className="flex flex-col items-center">
      <div style={{ width: '70%', margin: 'auto' }}>
        <CircularProgressbar
          value={nutrition.calories}
          text={`${nutrition.calories.toFixed(0)}`}
          maxValue={2000} 
          styles={progressBarStyles}
        />
        <p className="text-md font-semibold text-center text-gray-700 mt-2 mb-3">CALS EATEN</p>
      </div>

      <div className="text-stone-600 text-sm font-normal font-['Work Sans'] mb-3">MACRO BREAKDOWN V</div>
      
      <div className="w-full p-4 bg-stone-50 rounded-2xl shadow-md inline-flex justify-around items-center mt-4">
        <MacroCounter label="Carbs" value={nutrition.carbohydrates} percentage={carbsPercent} />
        <MacroCounter label="Protein" value={nutrition.protein} percentage={proteinPercent} />
        <MacroCounter label="Fat" value={nutrition.fat} percentage={fatPercent} />
      </div>
    </div>
  );
};

export default MacroBreakdown;
