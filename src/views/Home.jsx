import React from 'react';
import { motion } from 'framer-motion';

const CaloriesLeft = ({ calories, totalCalories }) => {
  const percentage = (calories / totalCalories) * 100;
  const eatenPercentage = 100 - percentage;

  const circleVariants = {
    initial: {
      strokeDashoffset: 100,
      transition: { duration: 1 },
    },
    animate: {
      strokeDashoffset: 100 - percentage,
      transition: { duration: 1 },
    },
  };

  const eatenCircleVariants = {
    initial: {
      strokeDashoffset: 100,
      transition: { duration: 1 },
    },
    animate: {
      strokeDashoffset: 100 - eatenPercentage,
      transition: { duration: 1 },
    },
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#F3F4F6]">
      <div className="relative">
        <div className="w-48 h-48">
          <motion.svg
            viewBox="0 0 36 36"
            className="w-48 h-48 stroke-[#d1d5db]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.circle
              variants={circleVariants}
              initial="initial"
              animate="animate"
              cx="18"
              cy="18"
              r="16"
              fill="transparent"
              strokeWidth="4"
              strokeDasharray="100"
              strokeDashoffset="100"
            />
            <motion.circle
              variants={eatenCircleVariants}
              initial="initial"
              animate="animate"
              cx="18"
              cy="18"
              r="16"
              fill="transparent"
              strokeWidth="4"
              strokeDasharray="100"
              strokeDashoffset="100"
              stroke="rgba(16, 185, 129, 0.2)"
            />
          </motion.svg>
          <div className="absolute inset-0 m-2 bg-white rounded-full w-44 h-44 flex items-center justify-center">
            <span className="text-center">
              <span className="block text-[#6B7280] font-normal text-lg mt-4">CALS LEFT</span>
              <span className="block text-[#5A6D57] font-normal text-2xl mt-2">{calories}</span>
            </span>
          </div>
          <div className="absolute bottom-0 right-0 mr-5 mb-5 text-xl font-normal text-[#5A6D57]">{totalCalories - calories}</div>
        </div>
      </div>
    </div>
  );
};

export default CaloriesLeft;