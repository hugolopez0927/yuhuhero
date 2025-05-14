import React from 'react';
import { useGameStore } from '../store/useGameStore';

const Header: React.FC = () => {
  const { coins } = useGameStore();
  
  return (
    <div className="bg-transparent text-white py-6 z-10 relative text-center">
      <h1 className="text-3xl font-bold tracking-wide leading-tight">
        AVENTURA<br />FINANCIERA
      </h1>
    </div>
  );
};

export default Header; 