import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './pages/Login';
// import Register from './pages/Register';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import styled, { keyframes } from 'styled-components';
import { gsap } from 'gsap';
import SingleProduct from './pages/SingleProduct';

const App = () => {
  const loaderRef = useRef(null);
  const textRef = useRef(null);
  const barsRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (loaderRef.current) {
          loaderRef.current.style.display = 'none';
        }
      }
    });

    tl.to(textRef.current, {
      scale: 1.5,
      duration: 1.5,
      ease: 'power2.inOut',
    })
    .to(textRef.current, {
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut',
    }, "-=0.5")
    .to(barsRef.current, {
      y: -window.innerHeight,
      stagger: 0.2,
      duration: 1.5,
      ease: 'power2.inOut',
    }, "-=1");
  }, []);

  return (
    <Router>
      <Loader ref={loaderRef}>
        <div ref={el => barsRef.current[0] = el} className="bars"></div>
        <div ref={el => barsRef.current[1] = el} className="bars"></div>
        <div ref={el => barsRef.current[2] = el} className="bars"></div>
        <div ref={el => barsRef.current[3] = el} className="bars"></div>
        <div ref={el => barsRef.current[4] = el} className="bars"></div>
        <div ref={el => barsRef.current[5] = el} className="bars"></div>
        <div ref={el => barsRef.current[6] = el} className="bars"></div>
        <ShiningText ref={textRef}>UrbanMart</ShiningText>
      </Loader>
      <NavBar />
      <Routes>
        {/* <Route path='/auth/login' element={<Login />} />
        <Route path='/auth/register' element={<Register />} /> */}
        <Route path='/' element={<Home />} />
        <Route path='/product/:id' element={<SingleProduct />} />
      </Routes>
    </Router>
  );
};

const shine = keyframes`
  0% {
    background-position: -200%;
  }
  100% {
    background-position: 200%;
  }
`;

const ShiningText = styled.h1`
  position: absolute;
  color: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3vh;
  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0.2)
  );
  background-size: 200% auto;
  animation: ${shine} 2s linear infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Loader = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 1001;
  display: flex;

  .bars {
    height: 100%;
    width: calc(100%/7);
    background-color: #000000;
  }
`;

export default App;
