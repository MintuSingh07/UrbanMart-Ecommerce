import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const SingleProduct = () => {
    const [quantity, setQuantity] = useState(1);
    const [userId, setUserId] = useState('');
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);
    const { id } = useParams();

    const handleIncrement = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('urban_auth_token');
        if (token) {
            const decodedData = jwtDecode(token);
            setUserId(decodedData.id);
        }
    }, [])

    useEffect(() => {
        if (id && userId) {
            axios.post(`http://localhost:8000/product/${id}`, {
                userId: userId
            })
                .then(response => {
                    setProduct(response.data.product);
                    setRelatedProducts(response.data.relatedProducts);
                    console.log();
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [id, userId]);

    return (
        <Container>
            <FlexContainer>
                <ImageColumn>
                    <OtherImages></OtherImages>
                    <OtherImages></OtherImages>
                    <OtherImages></OtherImages>
                    <OtherImages></OtherImages>
                    <OtherImages></OtherImages>
                </ImageColumn>
                <MainImgFrame></MainImgFrame>
            </FlexContainer>
            <FlexColumn>
                <Title>{product.title}</Title>
                <p style={{fontSize: "2vh"}}>{product.description}</p>
                <Subtitle>By Puma</Subtitle>
                <PriceContainer>
                    <Price>${Math.floor(product.price)}</Price>
                    <OriginalPrice>${Math.floor(product.price + 99)}</OriginalPrice>
                    <Discount>30% off</Discount>
                </PriceContainer>
                <StockInfo>
                    {
                        product.isOutOfStock ? (
                            <OutOfStock>Out of stock: We will notify you if the product get in stock</OutOfStock>
                        ) : (
                            <>
                                <InStock>In stock:</InStock>
                                <DeliveryTime> Delivered in 5 working days</DeliveryTime>
                            </>
                        )
                    }
                </StockInfo>
                <QuantityContainer>
                    <Label>Quantity</Label>
                    <Box>
                        <Button onClick={handleIncrement}>+</Button>
                        <Quantity>{quantity}</Quantity>
                        <Button onClick={handleDecrement}>-</Button>
                    </Box>
                </QuantityContainer>
            </FlexColumn>
            {relatedProducts.map((product)=> (
                <h1>{product.title}</h1>
            ))}
        </Container>
    );
};

const Container = styled.div`
    min-height: 100vh;
    width: 100%;
    display: flex;
    padding: 5vh;
    justify-content: space-around;

    @media (max-width: 768px) {
        flex-direction: column
    }
`;

const FlexContainer = styled.div`
    display: flex;
`;

const ImageColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.23vh;
    margin-right: 1vh;
`;

const OtherImages = styled.div`
    height: 10vh;
    width: 10vh;
    background-color: #adadad;
`;

const MainImgFrame = styled.div`
    height: 55vh;
    width: 70vh;
    background-color: #a7a7a7;
    margin-right: 10vh
`;

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5vh;
`;

const Title = styled.h1`
    color: black;
    font-size: 3.5vh;
    font-weight: 400;
`;

const Subtitle = styled.p`
    color: #585858;
    font-size: 2.2vh;
    margin-top: 1vh;
`;

const PriceContainer = styled.div`
    display: flex;
    align-items: baseline;
    margin-top: 5vh;
`;

const Price = styled.h3`
    color: black;
    font-size: 3.5vh;
    font-weight: 500;
`;

const OriginalPrice = styled.s`
    color: #3b3b3b;
    font-size: 2.5vh;
    margin-left: 1vh;
`;

const Discount = styled.p`
    color: red;
    font-size: 2vh;
    margin-left: 1vh;
    font-weight: 100;
`;

const StockInfo = styled.div`
    font-size: 2vh;
    margin-top: .3vh;
`;

const InStock = styled.span`
    color: green;
`;

const OutOfStock = styled.span`
    color: red;
`

const DeliveryTime = styled.span``;

const QuantityContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 3vh;
`;

const Label = styled.span`
    font-size: 2.3vh;
    font-weight: 400;
    margin-right: 2vh;
`;

const Box = styled.div`
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    background-color: #e6e6e6;
    border-radius: 0.5vh;
`;

const Button = styled.button`
    color: #000000;
    border: none;
    padding: .5vh 1vh;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 2.5vh;
    margin: 0 1vh;
    cursor: pointer;
    border-radius: 0.5vh;
`;

const Quantity = styled.span`
    font-size: 2vh;
    font-weight: 500;
`;

export default SingleProduct;
