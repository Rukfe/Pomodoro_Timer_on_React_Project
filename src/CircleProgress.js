// CircleProgress.js
import React from 'react';

const CircleProgress = ({ percentage, children }) => {
  const radius = 120; // радиус круга
  const stroke = 8; // толщина линии обводки
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = (percentage / 100) * circumference;

  return (
    <div className="circle-container">
      <svg
        height={radius * 2}
        width={radius * 2}
      >
        {/* Background circle */}
        <circle
          stroke="#e6e6e6"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress circle */}
        <circle
          stroke="#b942f5" // цвет обводки
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeLinecap="round" // Добавляем закругление
          transform={`rotate(270 ${radius} ${radius})`}
        />
      </svg>
      {/* Container for the text */}
      <div className="circle-content">
        {children}
      </div>
    </div>
  );
};

export default CircleProgress;
