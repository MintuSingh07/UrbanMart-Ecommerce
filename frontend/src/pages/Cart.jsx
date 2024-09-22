import React from 'react';
import styled from 'styled-components';
import useStore from '../app/store';

const Cart = () => {
    const cartProducts = useStore((state) => state.cartProducts);

    return (
        <CartContainer>
            <h1>Cart</h1>
            {cartProducts.length > 0 ? (
                <ProductList>
                    {cartProducts.map((product) => (
                        <ProductItem key={product.id}>
                            <ProductInfo>
                                <h2>{product.title}</h2>
                                <p>Price: ${product.price}</p>
                            </ProductInfo>
                        </ProductItem>
                    ))}
                </ProductList>
            ) : (
                <EmptyMessage>Your cart is empty!</EmptyMessage>
            )}
        </CartContainer>
    );
};

const CartContainer = styled.div`
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
`;

const ProductList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const ProductItem = styled.li`
    margin: 1rem 0;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
`;

const ProductInfo = styled.div`
    text-align: left;
`;

const EmptyMessage = styled.p`
    font-size: 1.2rem;
    color: #666;
`;

export default Cart;
