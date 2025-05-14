import React from 'react';

interface GameTileProps {
  type: 'savings' | 'investment' | 'debt';
}

const GameTile: React.FC<GameTileProps> = ({ type }) => {
  const colors = {
    savings: '#4ADE80',
    investment: '#F59E0B',
    debt: '#8B5CF6',
  };

  return (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="50" height="50" rx="6" fill={colors[type]}/>
      <rect x="4" y="4" width="42" height="42" rx="4" stroke="white" strokeOpacity="0.3" strokeWidth="2"/>
    </svg>
  );
};

export default GameTile; 