import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #131313;
  padding: 20px;
  height: 90%;
  width: 60%;
  border-radius: 2vh;
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    width: 90%; /* Adjusted width for smaller screens */
    padding: 10px; /* Reduced padding for mobile */
  }
`;

const FormContainer = styled.div`
  background-color: #131313;
  padding: 30px;
  border-radius: 10px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin-right: 20px;

  @media (max-width: 768px) {
    margin-right: 0;
    width: 100%;
    padding: 20px; /* Smaller padding for mobile */
  }
`;

const Header = styled.div`
  margin-bottom: 3vh;
  font-size: 1.2rem;

  h1 {
    font-size: 1.8rem; /* Slightly smaller for mobile */
    margin: 0;
  }

  p {
    font-size: 0.9rem;
    color: #888888;
    margin-top: 5px;
  }

  a {
    color: #FF5B31;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const InputField = styled.input`
  background-color: #333333;
  border: none;
  border-radius: 5px;
  color: #ffffff;
  padding: 15px 10px 5px 10px;
  font-size: 1rem;
  width: 100%;
  outline: 0;

  &::placeholder {
    color: transparent;
  }

  &:focus + label,
  &:not(:placeholder-shown) + label {
    top: 0px;
    left: 10px;
    font-size: 0.8rem;
    color: #FF5B31;
    font-weight: 400;
  }
`;

const Label = styled.label`
  position: absolute;
  left: 15px;
  top: 50%;
  color: #aaaaaa;
  font-size: 1rem;
  pointer-events: none;
  transition: all 0.2s ease;
  transform: translateY(-50%);
`;

const SubmitButton = styled.button`
  background-color: #FF5B31;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #fd5025;
  }
`;

const GreenContainer = styled.div`
  flex: 1;
  background-color: #00a884; /* Green background */
  border-radius: 10px;
  margin-left: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    padding: 20px;
  }
`;

const GreenText = styled.h2`
  color: #ffffff;
  font-size: 2rem;

  @media (max-width: 768px) {
    font-size: 1.5rem; /* Reduced font size for mobile */
  }
`;

// Main Component
const Register = () => {
    return (
        <div style={{ height: "100vh", width: "100%", padding: "10vh 0", backgroundColor: "#323232", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Container>
                <FormContainer>
                    <Header>
                        <p>START FOR FREE</p>
                        <h1>Create your account</h1>
                        <p>
                            Already a member? <Link to='/auth/login'>Log in</Link>
                        </p>
                    </Header>

                    <InputContainer>
                        <InputField type="text" placeholder=" " id="fullName" />
                        <Label htmlFor="fullName">Full Name</Label>
                    </InputContainer>

                    <InputContainer>
                        <InputField type="email" placeholder=" " id="email" />
                        <Label htmlFor="email">E-mail</Label>
                    </InputContainer>

                    <InputContainer>
                        <InputField type="password" placeholder=" " id="password" />
                        <Label htmlFor="password">Password</Label>
                    </InputContainer>

                    <SubmitButton>Create account</SubmitButton>
                </FormContainer>

                <GreenContainer>
                    <GreenText>Green Background</GreenText>
                </GreenContainer>
            </Container>
        </div>
    );
};

export default Register;
