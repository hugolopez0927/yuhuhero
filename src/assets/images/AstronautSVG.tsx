import React from 'react';

const AstronautSVG: React.FC = () => {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Helmet */}
      <circle cx="60" cy="40" r="35" fill="#0F172A" stroke="white" strokeWidth="2"/>
      <circle cx="60" cy="40" r="30" fill="white"/>
      
      {/* Face/Visor */}
      <circle cx="50" cy="35" r="6" fill="#0F172A" fillOpacity="0.7"/>
      
      {/* Body */}
      <rect x="40" y="72" width="40" height="35" rx="8" fill="white"/>
      
      {/* Arms */}
      <rect x="25" y="80" width="15" height="10" rx="5" fill="white"/>
      <rect x="80" y="80" width="15" height="10" rx="5" fill="white"/>
      
      {/* Legs */}
      <rect x="45" y="107" width="10" height="15" rx="5" fill="white"/>
      <rect x="65" y="107" width="10" height="15" rx="5" fill="white"/>
      
      {/* Backpack */}
      <rect x="50" y="75" width="20" height="25" rx="5" fill="#E5E7EB"/>
    </svg>
  );
};

export default AstronautSVG; 