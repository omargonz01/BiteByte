import React, { useState } from 'react';
import './Meal.css';


const Meal = ({ meal }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4">
      <div className="flex justify-between items-center cursor-pointer" onClick={toggleExpand}>
        <div className="text-lg font-bold">{meal.dish}</div>
        <div className="text-sm text-gray-500">
          {(meal.macros?.calories ?? 0).toFixed(0)} kcal
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4">
          <div className="text-sm text-gray-500">Ingredients:</div>
          {meal.ingredients?.map((ingredient, index) => (
            <div key={index} className="mt-2">
              <div className="font-bold">{ingredient.name}</div>
              <div>Calories: {(ingredient.calories ?? 0).toFixed(0)} kcal</div>
              <div>Carbs: {(ingredient.carbs ?? 0).toFixed(0)}g</div>
              <div>Protein: {(ingredient.protein ?? 0).toFixed(0)}g</div>
              <div>Fat: {(ingredient.fat ?? 0).toFixed(0)}g</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Meal;
