import React from 'react';

const SkyBackgroundImage: React.FC = () => {
  return (
    <div 
      className="absolute inset-0 w-full h-full" 
      style={{
        backgroundImage: "url('/assets/images/sky.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: -2
      }}
    />
  );
};

export default SkyBackgroundImage; 