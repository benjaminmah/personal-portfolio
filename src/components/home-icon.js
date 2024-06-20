import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home-icon.css';

const HomeIcon = () => {
  const baseUrl = process.env.PUBLIC_URL || '';
  return (
    <div className="home-icon-container">
      <Link to="/" className="home-icon">
        <img src={`${baseUrl}/icons/frog1.png`} alt="Home Icon" />
        <span>benjamin mah</span>
      </Link>
    </div>
  );
}

export default HomeIcon;
