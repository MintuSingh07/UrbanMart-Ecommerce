import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode correctly
import styled from 'styled-components';

const NavBar = () => {
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('urban_auth_token');
        if (token) {
            const decodedData = jwtDecode(token);
            setUserName(decodedData.userName);
            setIsLoggedin(true);
        }
    }, []);

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
                <NavLink>
                    <i className="fa-solid fa-cart-shopping"></i>
                    <NavLinkText>Cart</NavLinkText>
                </NavLink>
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
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #28c900;

  @media (max-width: 768px) {
    font-size: 18px; /* Adjust the font size for smaller screens */
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
  color: black;

  @media (max-width: 768px) {
    & > span {
      display: none;
    }
  }
`;

const NavLinkText = styled.span`
  margin-left: 5px;
`;