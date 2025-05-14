import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, SavingsIcon, InvestmentIcon, DebtIcon } from '../assets/images/NavIcons';

const BottomNav: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around items-center py-2 z-20">
      <Link to="/" className="menu-item text-space">
        <HomeIcon isActive={location.pathname === '/'} />
        <span className={`text-xs ${location.pathname === '/' ? 'text-savings font-bold' : 'text-space'}`}>Inicio</span>
        {location.pathname === '/' && <div className="absolute bottom-0 w-full h-1 bg-savings"></div>}
      </Link>
      
      <Link to="/ahorro" className="menu-item text-savings">
        <SavingsIcon isActive={location.pathname === '/ahorro'} />
        <span className={`text-xs ${location.pathname === '/ahorro' ? 'text-savings font-bold' : 'text-savings'}`}>Ahorro</span>
        {location.pathname === '/ahorro' && <div className="absolute bottom-0 w-full h-1 bg-savings"></div>}
      </Link>
      
      <Link to="/inversion" className="menu-item text-investment">
        <InvestmentIcon isActive={location.pathname === '/inversion'} />
        <span className={`text-xs ${location.pathname === '/inversion' ? 'text-investment font-bold' : 'text-investment'}`}>Inversión</span>
        {location.pathname === '/inversion' && <div className="absolute bottom-0 w-full h-1 bg-investment"></div>}
      </Link>
      
      <Link to="/deudas" className="menu-item text-debt">
        <DebtIcon isActive={location.pathname === '/deudas'} />
        <span className={`text-xs ${location.pathname === '/deudas' ? 'text-debt font-bold' : 'text-debt'}`}>Deudas</span>
        {location.pathname === '/deudas' && <div className="absolute bottom-0 w-full h-1 bg-debt"></div>}
      </Link>
    </div>
  );
};

export default BottomNav; 