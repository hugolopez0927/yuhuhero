import React from 'react';

const EarthSVG: React.FC = () => {
  return (
    <svg width="500" height="200" viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="250" cy="350" rx="300" ry="300" fill="#0F172A"/>
      <ellipse cx="250" cy="350" rx="280" ry="280" fill="#1E40AF"/>
      
      {/* Continentes */}
      <path d="M150 100C180 80 250 90 280 110C310 130 350 120 370 140C390 160 400 200 420 220C440 240 460 250 470 280C480 310 450 350 420 370C390 390 350 400 310 410C270 420 230 430 190 420C150 410 120 380 100 350C80 320 70 280 90 250C110 220 120 120 150 100Z" fill="#4ADE80"/>
      
      {/* Islas */}
      <circle cx="400" cy="200" r="20" fill="#4ADE80"/>
      <circle cx="100" cy="250" r="15" fill="#4ADE80"/>
      <circle cx="350" cy="300" r="25" fill="#4ADE80"/>
    </svg>
  );
};

export default EarthSVG; 