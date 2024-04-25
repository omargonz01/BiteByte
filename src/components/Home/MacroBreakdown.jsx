import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const MacroBreakdown = ({ nutrition }) => {
  return (
    <div className="macro-container">
      <div className="progress-bar">
        <CircularProgressbar
          value={nutrition.calories}
          text={`${nutrition.calories.toFixed(2)} cal`}
          maxValue={2000}  // Adjust this value as per your application's needs
          styles={buildStyles({
            textSize: '16px',
            pathColor: `rgba(62, 152, 199, ${nutrition.calories / 2000})`,
            textColor: '#4b5563',
            trailColor: '#d6d6d6',
          })}
        />
        <div className="progress-label">CALS EATEN</div>
      </div>
      <div className="macro-nutrients">
        <div className="macro-nutrient">
          <span className="nutrient-value">{nutrition.carbohydrates.toFixed(2)}g</span>
          <span className="nutrient-label">Carbs</span>
        </div>
        <div className="macro-nutrient">
          <span className="nutrient-value">{nutrition.protein.toFixed(2)}g</span>
          <span className="nutrient-label">Protein</span>
        </div>
        <div className="macro-nutrient">
          <span className="nutrient-value">{nutrition.fat.toFixed(2)}g</span>
          <span className="nutrient-label">Fat</span>
        </div>
      </div>
    </div>
  );
};

export default MacroBreakdown;
