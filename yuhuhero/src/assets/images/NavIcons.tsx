import React from 'react';

export const HomeIcon: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" 
        fill={isActive ? '#4ADE80' : 'none'} 
        stroke={isActive ? '#4ADE80' : '#0b1033'} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M9 22V12H15V22" 
        fill={isActive ? '#4ADE80' : 'none'} 
        stroke={isActive ? '#4ADE80' : '#0b1033'} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SavingsIcon: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle 
        cx="12" 
        cy="12" 
        r="10" 
        fill={isActive ? '#4ADE80' : 'none'} 
        stroke={isActive ? '#4ADE80' : '#10b981'} 
        strokeWidth="2"
      />
      <path 
        d="M15 9C15 9 13.5 7.5 12 7.5C10.5 7.5 9 9 9 9" 
        stroke={isActive ? 'white' : '#10b981'} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <path 
        d="M8.5 13.5C8.5 13.5 10 16.5 12 16.5C14 16.5 15.5 13.5 15.5 13.5" 
        stroke={isActive ? 'white' : '#10b981'} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </svg>
  );
};

export const InvestmentIcon: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle 
        cx="12" 
        cy="12" 
        r="10" 
        fill={isActive ? '#F59E0B' : 'none'} 
        stroke={isActive ? '#F59E0B' : '#f59e0b'} 
        strokeWidth="2"
      />
      <path 
        d="M8 12L12 8M12 8L16 12M12 8V16" 
        stroke={isActive ? 'white' : '#f59e0b'} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const DebtIcon: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle 
        cx="12" 
        cy="12" 
        r="10" 
        fill={isActive ? '#8B5CF6' : 'none'} 
        stroke={isActive ? '#8B5CF6' : '#8b5cf6'} 
        strokeWidth="2"
      />
      <circle 
        cx="12" 
        cy="12" 
        r="4" 
        fill={isActive ? 'white' : '#8b5cf6'} 
      />
    </svg>
  );
}; 