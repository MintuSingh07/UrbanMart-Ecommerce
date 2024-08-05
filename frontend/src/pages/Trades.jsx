import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
    padding: 20px;
    position: relative;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
`;

const Title = styled.h1`
    margin: 0;
`;

const Button = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    background-color: #ffffff;
    border: 1px solid black;
    outline: 0;
    border-radius: 1vh;
`;

const TradesList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
`;

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

const CardTitle = styled.h2`
    font-weight: 500;
    font-size: 2.5vh;
`;

const CardPrice = styled.p`
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

const CardDescription = styled.p`
    font-size: 1rem;
    color: #333;
    margin-bottom: 1vh;
    margin-top: 0.5vh;
`;

const TradeButton = styled.button`
    padding: 10px 20px;
    width: 100%;
    font-size: 2vh;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        height: 2.5vh;
        margin-right: 1vh;
    }
`;

const SelfTrades = styled.div`
    height: 20vh;
    width: 50%;
    background-color: #b5b5b5;
    position: fixed;
    bottom: ${(props) => (props.isVisible ? '0%' : '-100%')}; /* Change bottom based on visibility */
    left: 50%;
    transform: translate(-50%, 0%);
    transition: all 0.5s linear; /* Shorter transition for smoother animation */
`;

const Trades = () => {
    const [socket, setSocket] = useState(null);
    const [trades, setTrades] = useState([]);
    const [isSelfTradesVisible, setIsSelfTradesVisible] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('urban_auth_token');
        const newSocket = io('http://localhost:8000', {
            transports: ['websocket'],
            auth: { token }
        });

        newSocket.on('connect', () => {
            console.log('Connected to the server', newSocket.id);
        });

        newSocket.on('locationUpdate', (data) => {
            console.log('Location update received:', data);
        });

        newSocket.on('tradesWithinRadius', (data) => {
            console.log('Trades within radius received:', data);
            setTrades(data);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from the server', newSocket.id);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const sendLocationUpdate = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const locationData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    if (socket) {
                        console.log('Sending location update:', locationData);
                        socket.emit('locationUpdate', locationData);
                    }
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };

    const handleMyTrades = () => {
        setIsSelfTradesVisible(!isSelfTradesVisible);
    };

    return (
        <Container>
            <Header>
                <Title>Trades</Title>
                <Button onClick={sendLocationUpdate}>
                    <img src="/radar2.png" alt="Radar" />
                    <p style={{ marginLeft: "1vh" }}>Search Trades</p>
                </Button>
            </Header>
            <h2 style={{ marginBottom: "2vh" }}>Trades within 5 KM</h2>
            <TradesList>
                {trades.length > 0 ? (
                    trades.map((trade, index) => (
                        <CardContainer key={index}>
                            <ProductImage src={trade.image} alt={trade.name} loading='lazy' />
                            <CardContent>
                                <Link style={{ textDecoration: "none", color: "black" }} to={`/trade/${trade._id}`}>
                                    <CardTitle>{trade.name.length > 53 ? `${trade.name.substring(0, 53)}...` : trade.name}</CardTitle>
                                </Link>
                                <CardDescription>{trade.description}</CardDescription>
                                <p>Posted By:- {trade.user.userName}</p>
                                <CardPrice>Price: ${trade.price}</CardPrice>
                                <TradeButton onClick={handleMyTrades}>
                                    <img src="/trade.png" alt="Trade" />
                                    Trade
                                </TradeButton>
                            </CardContent>
                        </CardContainer>
                    ))
                ) : (
                    <p>No trades available nearby. Search for trades.</p>
                )}
            </TradesList>
            <SelfTrades isVisible={isSelfTradesVisible}></SelfTrades>
        </Container>
    );
};

export default Trades;
