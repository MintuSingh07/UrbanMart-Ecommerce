import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Trade from './pages/Trades';
import SingleProduct from './pages/SingleProduct';
import NavBar from './components/NavBar';
import Notifications from './pages/Notifications';
import Cart from './pages/Cart';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trades" element={<Trade />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
};

export default App;
