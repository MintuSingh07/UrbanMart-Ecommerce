import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import useStore from '../app/store';

const ProductCard = ({ title, description, price, images, productId, userId, isLiked }) => {
  const cardRef = useRef(null);
  const token = localStorage.getItem('urban_auth_token');
  const [like, setLike] = useState(isLiked);

  const { cartProducts, addToCartHandler, removeFromCartHandler } = useStore(state => ({
    cartProducts: state.cartProducts,
    addToCartHandler: state.addToCartHandler,
    removeFromCartHandler: state.removeFromCartHandler,
  }));

  const isProductInCart = cartProducts.some((item) => item.productId === productId);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, { y: -3, duration: 0.3, ease: 'power1.out' });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { y: 0, duration: 0.3, ease: 'power1.out' });
  };

  const handleLikeClick = async () => {
    setLike((prev) => !prev);
    await addToWishlist();
  };

  const addToWishlist = async () => {
    try {
      const endpoint = like ? 'delete-from-wishlist' : 'add-to-wishlist';
      const res = await axios.post(`http://localhost:8000/api/${endpoint}`, { productId, userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res.data);
    } catch (err) {
      console.log('Wishlist error: ', err);
      setLike((prev) => !prev);
    }
  };

  const handleAddToCart = () => {
    console.log('Added to cart');
    addToCartHandler({ title, description, price, productId,images });
  };

  const handleRemoveFromCart = () => {
    console.log('Removed from cart');
    removeFromCartHandler({ title, description, price, productId, images });
  };

  return (
    <CardContainer ref={cardRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div style={{height: "4vh", width: "4vh", backgroundColor: "white", position: "absolute", right: "2vh", top: "2vh", display: 'flex', alignItems: "center", justifyContent: "center", borderRadius: "50%"}}>
        <i
          onClick={handleLikeClick}
          style={{ fontSize: "2.5vh", cursor: 'pointer', color: like ? "red" : 'black' }}
          className={like ? "fa-solid fa-heart" : "fa-regular fa-heart"}
        ></i>
      </div>
      <ProductImage src={images[0]} alt="Product" />
      <CardContent>
        <Link style={{ textDecoration: "none", color: "black" }} to={`/product/${productId}`}>
          <Title>{title.length > 53 ? `${title.substring(0, 53)}...` : title}</Title>
        </Link>
        <Details>{description.length > 53 ? `${description.substring(0, 53)}...` : description}</Details>
        <Price>${price}</Price>
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
  background: rgba(255, 255, 255, 0.09);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.7px);
  border: 1px solid rgba(138, 138, 138, 0.29);

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
  border-radius: 1vh;
`;

const CardContent = styled.div`
  height: 20vh;
  padding: 1vh;
  position: relative;
`;

const Title = styled.h2`
  font-weight: 500;
  font-size: 2.5vh;
  color: #ffffff;
`;

const Price = styled.p`
  font-size: 1.5rem;
  color: #ffffff;
  margin: 0.5rem 0;
  font-weight: 600;
`;

const Details = styled.p`
  font-size: 1.7vh;
  color: rgb(175, 175, 177);
  margin-bottom: 1vh;
  margin-top: 0.5vh;
`;

const Button = styled.button`
  padding: 1.3vh 0rem;
  border: none;
  border-radius: .7vh;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.09);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.7px);
  border: 1px solid rgba(98, 98, 98, 0.29);
  color: #ffffff;
  font-weight: bold;
  position: absolute;
  width: 93%;
  top: 50;
  left: 50%;
  transform: translate(-50%, -0%);
  bottom: 1vh;
  font-size: 2vh;
`;

export default ProductCard;
