import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { UserProvider } from './context/UserContext';
import Navbar from './components/navBar/NavBar';
import Layout from './components/Layout/Layout';
import { ToastContainer } from 'react-toastify';
import 'nice-forms.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UserProvider>
      <App />
      <ToastContainer />
    </UserProvider>
  </BrowserRouter>
);