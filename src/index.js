import React from 'react';
import ReactDOM from 'react-dom';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './App.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/:id/:qrcode/:price/:token" element={ <App /> } />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
