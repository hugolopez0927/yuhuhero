import React from 'react';

const SkyBackground: React.FC = () => {
  return (
    <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Gradient de cielo */}
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
      
      {/* Fondo de cielo */}
      <rect width="1000" height="1000" fill="url(#skyGradient)" />
      
      {/* Estrellas pequeñas */}
      {Array.from({ length: 100 }).map((_, i) => (
        <circle 
          key={`star-${i}`}
          cx={Math.random() * 1000} 
          cy={Math.random() * 600} 
          r={Math.random() * 2 + 1}
          fill="white"
          opacity={Math.random() * 0.7 + 0.3}
        />
      ))}
      
      {/* Estrellas medianas */}
      {Array.from({ length: 20 }).map((_, i) => (
        <g key={`star-med-${i}`}>
          <circle 
            cx={Math.random() * 1000} 
            cy={Math.random() * 500} 
            r={Math.random() * 1.5 + 1.5}
            fill="white"
          />
          <g opacity="0.6">
            <line 
              x1={Math.random() * 1000} 
              y1={Math.random() * 500}
              x2={Math.random() * 1000} 
              y2={Math.random() * 500}
              stroke="white"
              strokeWidth="0.5"
            />
          </g>
        </g>
      ))}
      
      {/* Nubes sutiles */}
      <path d="M200 600 C300 580 350 620 450 600 S580 580 650 610 S750 630 850 620" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="40" />
      <path d="M150 650 C250 670 350 650 450 660 S550 680 650 650 S750 640 850 670" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="30" />
    </svg>
  );
};

export default SkyBackground; 