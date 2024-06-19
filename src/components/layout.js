import React from 'react';
import { Outlet } from 'react-router-dom';
import HomeIcon from './home-icon'; 
const Layout = () => {
  return (
    <div>
      <HomeIcon />
      <Outlet />
    </div>
  );
};

export default Layout;
