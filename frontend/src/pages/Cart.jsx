import React from 'react';
import styled from 'styled-components';
import useStore from '../app/store';

const Cart = () => {
    const cartProducts = useStore((state) => state.cartProducts);

    const calculateDeliveryDate = (days) => {
        const today = new Date();
        today.setDate(today.getDate() + days);
        return today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    };

    const deliveryDate = calculateDeliveryDate(2);

    const subtotal = cartProducts.reduce((acc, product) => acc + product.price, 0).toFixed(2);
    const discount = 49.00;
    const deliveryCharges = 40.00;
    const total = (subtotal - discount + deliveryCharges).toFixed(2);

    return (
        <CartContainer>
            <LeftPanel>
                <Header>Cart</Header>
                {cartProducts.length > 0 ? (
                    <ProductList>
                        {cartProducts.map((product) => (
                            <ProductItem key={product.id}>
                                <ProductInfo>
                                    <ProductImage style={{
                                        backgroundImage: `url(${product.images[0]})`,
                                    }}
                                    />
                                    <ProductDetails>
                                        <ProductTitle>
                                            {product.title.length > 30 ? `${product.title.substring(0, 30)}...` : product.title}
                                        </ProductTitle>
                                        <ProductDescription>
                                            {product.description.length > 40 ? `${product.description.substring(0, 40)}...` : product.description}
                                        </ProductDescription>
                                        <ProductPrice>Price: ₹{product.price.toFixed(2)}</ProductPrice>
                                    </ProductDetails>
                                    <DeliveryDate>
                                        Delivery by {deliveryDate}
                                    </DeliveryDate>
                                </ProductInfo>
                            </ProductItem>
                        ))}
                    </ProductList>
                ) : (
                    <EmptyMessage>Your cart is empty!</EmptyMessage>
                )}
            </LeftPanel>
            <RightPanel>
                <PriceDetailsHeader>Price Details</PriceDetailsHeader>
                <PriceBox>
                    <PriceSections>
                        <PriceLabel>Subtotal</PriceLabel>
                        <PriceValue>₹{subtotal}</PriceValue>
                    </PriceSections>
                    <hr style={{ opacity: ".2" }} />
                    <PriceSections>
                        <PriceLabel>Discount</PriceLabel>
                        <PriceValue style={{ color: "red" }}>- ₹{discount.toFixed(2)}</PriceValue>
                    </PriceSections>
                    <hr style={{ opacity: ".2" }} />
                    <PriceSections>
                        <PriceLabel>Delivery Charges</PriceLabel>
                        <PriceValue>₹{deliveryCharges.toFixed(2)}</PriceValue>
                    </PriceSections>
                    <hr style={{ opacity: ".2" }} />
                    <PriceSections>
                        <PriceLabel>Total</PriceLabel>
                        <TotalPriceValue>₹{total}</TotalPriceValue>
                    </PriceSections>
                    <CheckoutBtn>Checkout</CheckoutBtn>
                </PriceBox>
            </RightPanel>
        </CartContainer>
    );
};

const CartContainer = styled.div`
    min-height: 93.78vh;
    width: 100%;
    background-color: #161616;
    color: white;
    display: flex;
    flex-direction: row;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const LeftPanel = styled.div`
    min-height: 20vh;
    width: 60%;
    padding: 1vh 10vh;

    @media (max-width: 768px) {
        width: 100%;
        padding: 2vh 3vh;
    }
`;

const RightPanel = styled.div`
    min-height: 20vh;
    width: 40%;
    padding: 1vh 10vh;

    @media (max-width: 768px) {
        width: 100%;
        padding: 2vh 3vh;    
    }
`;

const Header = styled.h1`
    font-size: 4vh;
    font-weight: 500;
    text-align: center;
`;

const ProductList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const ProductItem = styled.li``;

const ProductInfo = styled.div`
    display: flex;
    margin: 5vh 0;
    position: relative;
`;

const ProductImage = styled.div`
    height: 15vh;
    width: 7vw;
    background-color: red;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    margin-right: 3vh;

    @media (max-width: 768px) {
        height: 7vh;
        width: 24%;
        margin-right: 2vh;
    }
`;

const ProductDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1vh;
`;

const ProductTitle = styled.p`
    font-size: 3vh;
    font-weight: 500;

    @media (max-width: 768px) {
        font-size: 2.5vh;
    }
`;

const ProductDescription = styled.p``;

const ProductPrice = styled.p`
    font-weight: 400;
    font-size: 2.2vh;

    @media (max-width: 768px) {
        font-size: 2vh;
    }
`;

const DeliveryDate = styled.p`
    font-size: 1.7vh;
    margin-left: 8vh;
    position: absolute;
    right: 1vh;

    @media (max-width: 768px) {
        display: none
    }
`;

const EmptyMessage = styled.p`
    font-size: 1.2rem;
    color: #666;
`;

const PriceDetailsHeader = styled.p`
    font-size: 3vh;
    font-weight: 500;
    margin-bottom: 5vh;

    @media (max-width: 768px) {
        margin-bottom: 2vh;
    }
`;

const PriceBox = styled.div`
    min-height: 20vh;
    overflow-y: auto;
`;

const PriceSections = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 2vh 0;
`;

const PriceLabel = styled.p`
    color: #a3a3a3;
`;

const PriceValue = styled.p`
    font-weight: 400;
`;

const TotalPriceValue = styled.p`
    font-weight: 400;
    font-size: 3vh;
`;

const CheckoutBtn = styled.button`
    padding: 2vh;
    width: 100%;
    border-radius: 2vh;
    font-weight: 500;
    outline: 0;
    margin-top: 2vh;
    background: rgba(255, 255, 255, 0.09);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(8.7px);
    border: 1px solid rgba(138, 138, 138, 0.29);
    color: white;
    cursor: pointer;
`;

export default Cart;
