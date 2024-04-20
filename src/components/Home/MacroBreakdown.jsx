import React, { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './MacroBreakdown.css';

const MacroBreakdown = ({ initialCalories, carbs, protein, fat }) => {
  const [caloriesEaten, setCaloriesEaten] = useState(initialCalories);

  // Mock function to simulate adding calories
  // Replace this with the actual function that receives calorie data from the scanned food
  const addCalories = (newCalories) => {
    setCaloriesEaten(caloriesEaten + newCalories);
  };


  return (
     <div className="macro-container">
      <div className="progress-bar">
        <CircularProgressbar
          value={caloriesEaten}
          text={`${caloriesEaten} CALS`}
          styles={buildStyles({
            textColor: 'gray',
            pathColor: 'green',
          })}
        />
        <div className="progress-label">CALS EATEN</div>
      </div>
      <div className="macro-nutrients">
        <div className="macro-nutrient">
          <span className="nutrient-label">Carbs</span>
          <div className="nutrient-value">{carbs}g</div>
        </div>
        <div className="macro-nutrient">
          <span className="nutrient-label">Protein</span>
          <div className="nutrient-value">{protein}g</div>
        </div>
        <div className="macro-nutrient">
          <span className="nutrient-label">Fat</span>
          <div className="nutrient-value">{fat}g</div>
        </div>
      </div>
    </div>
  );
};

export default MacroBreakdown;


// import React from 'react';
// import './MacroBreakdown.css'; // Ensure this is the correct path to your CSS file

// const MacroBreakdown = ({ carbs, protein, fat }) => {
//   return (
//     <div className="macro-container">
//       <div className="progress-bar">
//         <div className="progress-text">2000</div>
//         <div className="progress-label">0 EATEN</div>
//       </div>
//       <div className="macro-nutrients">
//         <div className="macro-nutrient">
//           <span className="nutrient-label">Carbs</span>
//           <div className="nutrient-value">{carbs}g</div>
//         </div>
//         <div className="macro-nutrient">
//           <span className="nutrient-label">Protein</span>
//           <div className="nutrient-value">{protein}g</div>
//         </div>
//         <div className="macro-nutrient">
//           <span className="nutrient-label">Fat</span>
//           <div className="nutrient-value">{fat}g</div>
//         </div>
//       </div>
//       <div className="guide-tag">Guide <span className="coming-soon">Coming Soon</span></div>
//       <nav className="macro-nav">
//         {/* Navigation items here */}
//       </nav>
//     </div>
//   );
// };

// export default MacroBreakdown;