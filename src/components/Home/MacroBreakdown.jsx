import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './MacroBreakdown.css';

const MacroBreakdown = ({ nutrition }) => {
  // Define state for macros with default values
  const [macros, setMacros] = useState({
    carbs: 0,
    protein: 0,
    fat: 0,
    calories: 0
  });

  // Effect to update macros state whenever nutrition prop changes
  useEffect(() => {
    if (nutrition) {
      setMacros({
        carbs: nutrition.carbs || 0,
        protein: nutrition.protein || 0,
        fat: nutrition.fat || 0,
        calories: nutrition.calories || 0
      });
    }
  }, [nutrition]);

  return (
    <div className="macro-container">
      <div className="progress-bar">
        <CircularProgressbar
          value={macros.calories}
          text={`${macros.calories.toFixed(2)}`}
          maxValue={2000}  
          styles={buildStyles({
            textSize: '16px',
            pathColor: `rgba(62, 152, 199, ${macros.calories / 2000})`,
            textColor: '#4b5563',
            trailColor: '#d6d6d6',
          })}
        />
        <div className="progress-label">CALS EATEN</div>
      </div>
      <div className="macro-nutrients">
        <div className="macro-nutrient">
          <span className="nutrient-value">Carbs</span>
          <span className="nutrient-label">/ {macros.carbs.toFixed(2)}g</span>
        </div>
        <div className="divider"></div>
        <div className="macro-nutrient">
          <span className="nutrient-value">Protein</span>
          <span className="nutrient-label">/ {macros.protein.toFixed(2)}g</span>
        </div>
        <div className="divider"></div>
        <div className="macro-nutrient">
          <span className="nutrient-value">Fat</span>
          <span className="nutrient-label">/ {macros.fat.toFixed(2)}g</span>
        </div>
      </div>
      <div className="guide-tag">
        <span className="coming-soon">Coming Soon</span>
        <span>Guide</span>
      </div>
    </div>
  );
};

export default MacroBreakdown;
