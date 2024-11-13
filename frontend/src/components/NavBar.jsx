import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import styled from 'styled-components';
import useStore from '../app/store';

const NavBar = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userName, setUserName] = useState('');
  const [countCartItem, setCountCartItem] = useState("");
  const cartProducts = useStore((state) => state.cartProducts)

  useEffect(() => {
    localStorage.setItem("urban_auth_token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjQ2ZWE1MzJhMGE5MzQ1ZTFhYjI3ZSIsInVzZXJOYW1lIjoiTWludHUgU2luZ2giLCJlbWFpbCI6Im1pbnR1dGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzIzMTAwODYxfQ.UuOGzI_GbMGDTV9QYdX__VSvZFt2MIkNRp0WDzXXyQk')
    const token = localStorage.getItem('urban_auth_token');
    if (token) {
      const decodedData = jwtDecode(token);
      setUserName(decodedData.userName);
      setIsLoggedin(true);
    }
  }, []);

  useEffect(() => {
    cartProducts.length > 99 ? setCountCartItem("99+") : setCountCartItem(cartProducts.length);
  }, [cartProducts])

  return (
    <Nav>
      <Logo>UrbanMart</Logo>
      <SearchBar>
        <input type="text" placeholder="Search for products, brands and more" />
      </SearchBar>
      <NavLinks>

        <Link style={{ color: "white", textDecoration: "none" }} to={isLoggedin ? '/profile' : '/auth/login'}>
          <NavLink>
            <i className="fa-solid fa-user"></i>
            <NavLinkText>{isLoggedin ? userName : "Login"}</NavLinkText>
          </NavLink>
        </Link>

        {
          isLoggedin ? (
            <>
              <Link style={{ color: "white", textDecoration: "none" }} to='/cart'>
                <NavLink>
                  <div style={{ position: "relative" }}>
                    <i className="fa-solid fa-cart-shopping"></i>
                    <Counter>{countCartItem}</Counter>
                  </div>
                  <NavLinkText>Cart</NavLinkText>
                </NavLink>
              </Link>

              <Link style={{ color: "white", textDecoration: "none" }} to='/notifications'>
                <NavLink>
                  <i class="fa-solid fa-bell"></i>
                  <NavLinkText>Notifications</NavLinkText>
                </NavLink>
              </Link>
            </>
          ) : (
            <></>
          )
        }
      </NavLinks>
    </Nav>
  );
};

export default NavBar;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  color: white;
  background-color: #161618;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #28c900;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const SearchBar = styled.div`
  flex-grow: 1;
  margin: 0 20px;
  outline: 0;
  border: 1px solid black;

  input {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 2px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const NavLink = styled.div`
  cursor: pointer;
  font-size: 2vh;
  display: flex;
  align-items: center;
  color: #ffffff;

  @media (max-width: 768px) {
    & > span {
      display: none;
    }
  }
`;

const NavLinkText = styled.span`
  margin-left: 5px;
`;

const Counter = styled.div`
  height: 2vh;
  width: 2vh;
  background-color: red;
  position: absolute;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  left: 1.3vh;
  bottom: 1.3vh;
`;