import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { styleReset } from 'react95';
import original from 'react95/dist/themes/original';
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';
import '@react95/icons/icons.css';

const GlobalStyles = createGlobalStyle`
  ${styleReset}

  /* React95 pixel font */
  @font-face {
    font-family: 'ms_sans_serif';
    src: url(${ms_sans_serif}) format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url(${ms_sans_serif_bold}) format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  /* CRT-style background (base color + animated scanlines overlay) */
  body {
    margin: 0;
    background-color: #0b1226; /* deep navy base (overridden in App) */
    color: #000;
    font-family: 'ms_sans_serif', Arial, sans-serif;
  }

  @keyframes crtScan {
    0% { background-position-y: 0; }
    100% { background-position-y: 4px; }
  }
  @keyframes crtFlicker {
    0%, 100% { opacity: 0.12; }
    50% { opacity: 0.16; }
  }
  body::before {
    content: '';
    position: fixed;
    z-index: -1;
    inset: 0;
    pointer-events: none;
    background-image: repeating-linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.08) 0px,
      rgba(255, 255, 255, 0.08) 1px,
      rgba(0, 0, 0, 0) 2px,
      rgba(0, 0, 0, 0) 4px
    );
    animation: crtScan 0.6s linear infinite, crtFlicker 3.2s ease-in-out infinite;
  }
`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={original}>
      <GlobalStyles />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
