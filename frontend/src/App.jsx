import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Trade from './pages/Trades';
import SingleProduct from './pages/SingleProduct';
import NavBar from './components/NavBar';
import Notifications from './pages/Notifications';
import Cart from './pages/Cart';
import Register from './pages/Register';
import Login from './pages/Login';
import TestTradePage from './pages/TestTradePage';

const App = () => {
  return (
    <Router>
      <MainContent />
    </Router>
  );
};

const MainContent = () => {
  const location = useLocation();

  // Corrected NavBar visibility logic
  const hideNavBar = location.pathname === '/auth/register' || location.pathname === '/auth/login' || location.pathname === '/trades';

  return (
    <>
      {!hideNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trades" element={<Trade />} />
        {/* <Route path="/trades" element={<TestTradePage />} /> */}
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;
