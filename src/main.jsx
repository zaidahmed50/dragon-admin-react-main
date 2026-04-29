import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
// import "bootstrap/dist/css/bootstrap.min.css";
// import * as bootstrap from 'bootstrap'
// import './assets/scss/theme.scss'
import "./styles/index.scss";
import { initializeCSSVariables } from './theme/cssVariables';

// Initialize CSS variables for dynamic theming
initializeCSSVariables();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
