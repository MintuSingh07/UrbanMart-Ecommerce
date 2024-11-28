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
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [id, userId]);

    return (
        <Container>
            <FlexContainer>
                {/* Image Column for larger screens */}
                <ImageColumn>
                    <OtherImages></OtherImages>
                    <OtherImages></OtherImages>
                    <OtherImages></OtherImages>
                    <OtherImages></OtherImages>
                    <OtherImages></OtherImages>
                </ImageColumn>

                {/* Main Image */}
                <MainImgFrame></MainImgFrame>

                {/* Image Carousel for smaller screens */}
                <MobileCarousel>
                    <div><OtherImages></OtherImages></div>
                    <div><OtherImages></OtherImages></div>
                    <div><OtherImages></OtherImages></div>
                    <div><OtherImages></OtherImages></div>
                    <div><OtherImages></OtherImages></div>
                </MobileCarousel>
            </FlexContainer>
            <FlexColumn>
                <Title>{product.title}</Title>
                <Description>{product.description}</Description>
                <PriceContainer>
                    <Price>${Math.floor(product.price)}</Price>
                    <OriginalPrice>${Math.floor(product.price + 99)}</OriginalPrice>
                    <Discount>30% off</Discount>
                </PriceContainer>
                <StockInfo>
                    {
                        product.isOutOfStock ? (
                            <OutOfStock>Out of stock: We will notify you if the product gets in stock</OutOfStock>
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
                <ButtonContainer>
                    <button>Buy Now</button>
                    <button>Add To Cart</button>
                </ButtonContainer>
            </FlexColumn>
        </Container>
    );
};

const Container = styled.div`
    min-height: 93vh;
    width: 100%;
    display: flex;
    padding: 5vh;
    color: white;

    @media (max-width: 768px) {
        flex-direction: column;
        padding: 2vh;
    }
`;

const FlexContainer = styled.div`
    display: flex;
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
    }
`;

const ImageColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.23vh;
    margin-right: 1vh;

    @media (max-width: 768px) {
        display: none; /* Hide on mobile */
    }
`;

const MobileCarousel = styled.div`
    display: none;

    @media (max-width: 768px) {
        display: block;
        width: 100%;
        display: flex;
        gap: 1vh;
        overflow-x: scroll;
        scale: 0.88;
    }
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
    margin-right: 10vh;

    @media (max-width: 768px) {
        width: 80vw;
        height: 50vw;
        margin-right: 0;
    }
`;

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5vh;
    width: 50%;

    @media (max-width: 768px) {
        width: 100%;
        margin-top: 5vh;
    }
`;

const Title = styled.h1`
    font-size: 3.5vh;
    font-weight: 500;
    margin-bottom: .2vh;
`;

const Description = styled.p`
    font-size: 2vh;
`;

const Subtitle = styled.p`
    color: #585858;
    font-size: 2.2vh;
    /* margin-top: 1vh; */
`;

const PriceContainer = styled.div`
    display: flex;
    align-items: baseline;
    /* margin-top: 5vh; */
`;

const Price = styled.h3`
    font-size: 3.5vh;
    font-weight: 500;
`;

const OriginalPrice = styled.s`
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
`;

const DeliveryTime = styled.span``;

const QuantityContainer = styled.div`
    display: none;
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

const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    /* justify-content: center; */
    gap: 2vh;

    button{
        padding: 1vh 2vh;
        cursor: pointer;
    }
`
export default SingleProduct;
