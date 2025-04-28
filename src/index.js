import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="992485768306-9gc13m6t2vg1ta1p8pk5ssim3vbo1thg.apps.googleusercontent.com">

  <BrowserRouter>
    <App />
  </BrowserRouter>
  </GoogleOAuthProvider>
);