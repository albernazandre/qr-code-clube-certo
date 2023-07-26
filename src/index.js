// rotas

import React from 'react';
import ReactDOM from 'react-dom';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import ExpiredToken from './ExpiredToken';  // Import the ExpiredToken component
import './App.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/qrcode" element={ <App /> } />
        <Route path="/qrcode/:id/:jwt" element={ <App /> } />
        <Route path="/expired" element={ <ExpiredToken /> } /> {/* Add the route for the ExpiredToken component */ }
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
