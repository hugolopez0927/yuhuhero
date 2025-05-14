import React from 'react';

const FoxSVG: React.FC = () => {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cuerpo y cabeza */}
      <ellipse cx="60" cy="70" rx="30" ry="25" fill="#F97316" />
      <circle cx="60" cy="45" r="25" fill="#F97316" />
      
      {/* Orejas */}
      <path d="M38 25L45 45L55 35Z" fill="#F97316" />
      <path d="M82 25L75 45L65 35Z" fill="#F97316" />
      
      {/* Interior orejas */}
      <path d="M42 30L47 42L53 36Z" fill="#FDBA74" />
      <path d="M78 30L73 42L67 36Z" fill="#FDBA74" />
      
      {/* Cara */}
      <ellipse cx="60" cy="50" rx="20" ry="18" fill="#FDBA74" />
      
      {/* Ojos */}
      <ellipse cx="50" cy="45" rx="5" ry="6" fill="white" />
      <ellipse cx="70" cy="45" rx="5" ry="6" fill="white" />
      <circle cx="50" cy="45" r="3" fill="#1E293B" />
      <circle cx="70" cy="45" r="3" fill="#1E293B" />
      <circle cx="48" cy="43" r="1" fill="white" />
      <circle cx="68" cy="43" r="1" fill="white" />
      
      {/* Nariz */}
      <path d="M55 55L60 60L65 55Z" fill="#1E293B" />
      
      {/* Hocico */}
      <path d="M60 60C60 60 52 65 50 70M60 60C60 60 68 65 70 70" stroke="#1E293B" strokeWidth="1.5" />
      
      {/* Bigotes */}
      <line x1="48" y1="56" x2="35" y2="54" stroke="#1E293B" strokeWidth="0.8" />
      <line x1="48" y1="58" x2="35" y2="58" stroke="#1E293B" strokeWidth="0.8" />
      <line x1="48" y1="60" x2="35" y2="62" stroke="#1E293B" strokeWidth="0.8" />
      <line x1="72" y1="56" x2="85" y2="54" stroke="#1E293B" strokeWidth="0.8" />
      <line x1="72" y1="58" x2="85" y2="58" stroke="#1E293B" strokeWidth="0.8" />
      <line x1="72" y1="60" x2="85" y2="62" stroke="#1E293B" strokeWidth="0.8" />
      
      {/* Cola */}
      <path d="M30 70C25 65 28 55 35 50C32 60 35 65 45 65" fill="#F97316" />
      <path d="M35 50C32 60 35 65 45 65" stroke="#F97316" strokeWidth="3" />
      
      {/* Patas */}
      <ellipse cx="45" cy="95" rx="8" ry="5" fill="#F97316" />
      <ellipse cx="75" cy="95" rx="8" ry="5" fill="#F97316" />
      <rect x="45" y="75" width="6" height="20" rx="3" fill="#F97316" />
      <rect x="70" y="75" width="6" height="20" rx="3" fill="#F97316" />
      
      {/* Detalles blancos */}
      <path d="M50 75C50 75 60 80 70 75C65 85 55 85 50 75Z" fill="white" />
    </svg>
  );
};

export default FoxSVG; 