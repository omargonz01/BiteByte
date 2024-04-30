import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./MacroBreakdown.css";

const dailyValues = {
  carbs: 1000,
  protein: 1000,
  fat: 1000,
};

// fixed to ensure exceeding totals does not break the UI
const calculatePercentage = (value, dailyValue) => {
  const percentage = (value / dailyValue) * 100;
  return Math.min(percentage, 100);
};

const MacroCounter = ({ label, value, percentage }) => (
  <div className="py-2 flex flex-col items-center gap-2">
    <div className="text-center text-neutral-800 text-sm font-normal">
      {label}
    </div>
    <div className="w-20 h-2.5 bg-stone-300 rounded-full overflow-hidden">
      <div
        className="custom-progress-bar h-2.5 rounded-full" 
        style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: '#5A6D57' }} 
      ></div>
    </div>
    <div className="text-center text-neutral-800 text-sm font-normal">
      {value.toFixed(0)}g
    </div>
  </div>
);

const MacroBreakdown = ({ nutrition }) => {
  // Calculate the percentage of the daily value for each macro
  const carbsPercent = nutrition && nutrition.carbohydrates ? calculatePercentage(
    nutrition.carbohydrates,
    dailyValues.carbs
  ) : 0;
  const proteinPercent = nutrition && nutrition.protein ? calculatePercentage(
    nutrition.protein,
    dailyValues.protein
  ) : 0;
  const fatPercent = nutrition && nutrition.fat ? calculatePercentage(nutrition.fat, dailyValues.fat) : 0;

  // Ensure calories is defined before calling toFixed()
  const caloriesValue = nutrition && nutrition.calories ? nutrition.calories.toFixed(0) : '0';

  // CircularProgressbar styles
  const progressBarStyles = buildStyles({
    pathColor: `#5A6D57`,
    textColor: "#4b5563",
    trailColor: "#d6d6d6",
    backgroundColor: "#3e98c7",
  });

  return (
    <div className="flex flex-col items-center">
      <div style={{ width: "70%", margin: "auto" }}>
        <CircularProgressbar
          value={Number(caloriesValue)} // Convert string back to number if needed
          text={caloriesValue}
          maxValue={4000}
          styles={progressBarStyles}
        />
        <p className="text-md font-semibold text-center text-gray-700 mt-2 mb-3">
          CALS EATEN
        </p>
      </div>

      <div className="text-stone-600 text-sm font-normal font-['Work Sans'] mb-3">
        MACRO BREAKDOWN V
      </div>

      <div className="w-full p-4 bg-stone-50 rounded-2xl shadow-md inline-flex justify-around items-center mt-4">
        <MacroCounter
          label="Carbs"
          value={nutrition && nutrition.carbohydrates ? nutrition.carbohydrates : 0}
          percentage={carbsPercent}
        />
        <MacroCounter
          label="Protein"
          value={nutrition && nutrition.protein ? nutrition.protein : 0}
          percentage={proteinPercent}
        />
        <MacroCounter
          label="Fat"
          value={nutrition && nutrition.fat ? nutrition.fat : 0}
          percentage={fatPercent}
        />
      </div>
    </div>
  );
};

export default MacroBreakdown;
