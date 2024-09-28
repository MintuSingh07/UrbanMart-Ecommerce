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

    const deliveryDate = calculateDeliveryDate(2); // Assuming delivery takes 2 days

    // Dynamic calculations
    const subtotal = cartProducts.reduce((acc, product) => acc + product.price, 0).toFixed(2);
    const discount = 49.00; // Example discount
    const deliveryCharges = 40.00; // Example delivery charges
    const total = (subtotal - discount + deliveryCharges).toFixed(2);

    return (
        <CartContainer>
            <div style={{ height: "92.7vh", width: "60%", padding: "1vh 10vh" }}>
                <Header>Cart</Header>
                {cartProducts.length > 0 ? (
                    <ProductList>
                        {cartProducts.map((product) => (
                            <ProductItem key={product.id}>
                                <ProductInfo>
                                    <div
                                        style={{
                                            height: "15vh",
                                            width: "7vw",
                                            backgroundColor: "red",
                                            overflow: "hidden",
                                            backgroundImage: `url(${product.images[0]})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            marginRight: "3vh"
                                        }}
                                    />
                                    <div style={{ gap: "1vh", display: "flex", flexDirection: "column" }}>
                                        <p style={{ fontSize: "3vh", fontWeight: "500" }}>{product.title.length > 30 ? `${product.title.substring(0, 30)}...` : product.title}</p>
                                        <p>{product.description.length > 40 ? `${product.description.substring(0, 40)}...` : product.description}</p>
                                        <p style={{ fontWeight: "400", fontSize: "2.2vh" }}>Price: ₹{product.price.toFixed(2)}</p>
                                    </div>
                                    <p style={{ fontSize: "1.7vh", marginLeft: "8vh", position: "absolute", right: "1vh"}}>
                                        Delivery by {deliveryDate}
                                    </p>
                                </ProductInfo>
                            </ProductItem>
                        ))}
                    </ProductList>
                ) : (
                    <EmptyMessage>Your cart is empty!</EmptyMessage>
                )}
            </div>
            <div style={{ height: "92.7vh", width: "40%", padding: "1vh 10vh" }}>
                <p style={{ fontSize: "3vh", fontWeight: "500", marginBottom: "5vh" }}>Price Details</p>
                <PriceBox>
                    <PriceSections>
                        <p style={{ color: '#a3a3a3' }}>Subtotal</p>
                        <p style={{ fontWeight: "400" }}>₹{subtotal}</p>
                    </PriceSections>
                    <hr style={{ opacity: ".2" }} />
                    <PriceSections>
                        <p style={{ color: '#a3a3a3' }}>Discount</p>
                        <p style={{ fontWeight: "400", color: "red" }}>- ₹{discount.toFixed(2)}</p>
                    </PriceSections>
                    <hr style={{ opacity: ".2" }} />
                    <PriceSections>
                        <p style={{ color: '#a3a3a3' }}>Delivery Charges</p>
                        <p style={{ fontWeight: "400" }}>₹{deliveryCharges.toFixed(2)}</p>
                    </PriceSections>
                    <hr style={{ opacity: ".2" }} />
                    <PriceSections>
                        <p style={{ color: '#a3a3a3' }}>Total</p>
                        <p style={{ fontWeight: "400", fontSize: "3vh" }}>₹{total}</p>
                    </PriceSections>
                    <CheckoutBtn>Checkout</CheckoutBtn>
                </PriceBox>
            </div>
        </CartContainer>
    );
};

const CartContainer = styled.div`
    height: 92.7vh;
    width: 100%;
    background-color: #161616;
    color: white;
    display: flex;
    flex-direction: row;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const ProductList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const ProductItem = styled.li`

`;

const ProductInfo = styled.div`
    display: flex;
    margin: 5vh 0;
    position: relative;
`;

const EmptyMessage = styled.p`
    font-size: 1.2rem;
    color: #666;
`;

const Header = styled.h1`
    font-size: 4vh;
    font-weight: 500;
    text-align: center;
    margin-bottom: 5vh;
`;

const PriceBox = styled.div`
    min-height: 50vh;
    overflow-y: auto;
`;

const PriceSections = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 2vh 0;
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
