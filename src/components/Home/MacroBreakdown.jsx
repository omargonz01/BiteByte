import React, { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './MacroBreakdown.css';

const MacroBreakdown = () => {
  const [macros, setMacros] = useState({
    carbs: 215,
    protein: 86,
    fat: 57
  });

  const totalCalories = 0;

  return (
    <div className="macro-container">
      <div className="progress-bar">
        <CircularProgressbar
          value={totalCalories}
          text={`${totalCalories}`}
          styles={buildStyles({
            textSize: '16px',
            pathColor: `rgba(62, 152, 199, ${totalCalories / 100})`,
            textColor: '#4b5563',
            trailColor: '#d6d6d6',
          })}
        />
        <div className="progress-label">CALS EATEN</div>
      </div>
      <div className="macro-nutrients">
        <div className="macro-nutrient">
          <span className="nutrient-value">Carbs</span>
          <span className="nutrient-label">/ {macros.carbs}g</span>
        </div>
        {/* Inserting divider lines based on the Figma design */}
        <div className="divider"></div>
        <div className="macro-nutrient">
          <span className="nutrient-value">Protein</span>
          <span className="nutrient-label">/ {macros.protein}g</span>
        </div>
        <div className="divider"></div>
        <div className="macro-nutrient">
          <span className="nutrient-value">Fat</span>
          <span className="nutrient-label">/ {macros.fat}g</span>
        </div>
      </div>
      {/* Add the 'Coming Soon' section here */}
      <div className="guide-tag">
        <span className="coming-soon">Coming Soon</span>
        <span>Guide</span>
      </div>
    </div>
  );
};

export default MacroBreakdown;
