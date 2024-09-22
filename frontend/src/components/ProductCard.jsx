import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import useStore from '../app/store';

const ProductCard = ({ title, description, price, rating, images, productId, userId, isLiked }) => {
  const cardRef = useRef(null);
  const token = localStorage.getItem('urban_auth_token');

  const { cartProducts, addToCartHandler, removeFromCartHandler } = useStore(state => ({
    cartProducts: state.cartProducts,
    addToCartHandler: state.addToCartHandler,
    removeFromCartHandler: state.removeFromCartHandler,
  }));

  const isProductInCart = cartProducts.some((item)=> item.productId === productId);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, { y: -3, duration: 0.3, ease: 'power1.out' });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { y: 0, duration: 0.3, ease: 'power1.out' });
  };

  const addToWishlist = async () => {
    try {
      const endpoint = isLiked ? 'delete-from-wishlist' : 'add-to-wishlist';
      const res = await axios.post(`http://localhost:8000/api/${endpoint}`, { productId, userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res.data);
    } catch (err) {
      console.log('Wishlist error: ', err);
    }
  };

  const handleLikeClick = () => {
    addToWishlist();
  };

  const handleAddToCart = () => {
    console.log('Added to cart');
    addToCartHandler({ title, description, price, productId });
  };

  const handleRemoveFromCart = () => {
    console.log('Removed from cart');
    removeFromCartHandler({ title, description, price, productId });
  };

  return (
    <CardContainer ref={cardRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <i
        onClick={handleLikeClick}
        style={{ position: "absolute", right: "2vh", top: "2vh", fontSize: "2.5vh", cursor: 'pointer', color: isLiked ? "red" : 'black' }}
        className={isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"}
      ></i>
      <ProductImage src={images[0]} alt="Product" />
      <CardContent>
        <Link style={{ textDecoration: "none", color: "black" }} to={`/product/${productId}`}>
          <Title>{title.length > 53 ? `${title.substring(0, 53)}...` : title}</Title>
        </Link>
        <Details>{description}</Details>
        <Price>${price}</Price>
        <Rating>Rating: {rating}⭐</Rating>
      </CardContent>
      <Button onClick={isProductInCart ? handleRemoveFromCart : handleAddToCart}>
        {isProductInCart ? 'Remove From Cart' : 'Add To Cart'}
      </Button>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  width: 20vw;
  padding: 1vh;
  border-radius: 1vh;
  cursor: pointer;
  position: relative;
  transition: transform 0.3s;

  @media (max-width: 768px) {
    width: 95vw;
  }
  @media (max-width: 480px) {
    width: 95vw;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 25vh;
  object-fit: cover;
  border-radius: 0.5vh;
`;

const CardContent = styled.div`
  padding: 1vh;
  position: relative;
`;

const Title = styled.h2`
  font-weight: 500;
  font-size: 2.5vh;
`;

const Price = styled.p`
  font-size: 1.5rem;
  color: #000;
  margin: 0.5rem 0;
  font-weight: 600;
`;

const Rating = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin: 0;
`;

const Details = styled.p`
  font-size: 1rem;
  color: #333;
  margin-bottom: 1vh;
  margin-top: 0.5vh;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5vh;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  font-weight: bold;

  &:hover {
    background-color: #0056b3;
  }
`;

export default ProductCard;
