import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import styled from 'styled-components';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import calculateDistance from '../utility/calculateDistance';

const Container = styled.div`
    position: relative;
    height: 100vh;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
`;

const Button = styled.button`
    padding: 0.8vh 1.5vh;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    background-color: #ffffff;
    border: 1px solid black;
    outline: 0;
    border-radius: 1vh;
    position: absolute;
    z-index: 99;
    right: 2vh;
    top: 2vh;

    @media (max-width: 768px) {
        scale: .8;
        top: 1vh;
        right: -1vh;
    }
`;

const MapWrapper = styled.div`
    height: 100%;
    width: 100%;
    position: relative;
    z-index: 1;
    background-color: #161617;

    @media (max-width: 768px) {
        height: 100vh;
    }
`;

const ImageOverlay = styled.img`
    position: absolute;
    top: 2vh;
    left: 2vh;
    z-index: 10;
    height: 4vh;
`;

const Sidebar = styled.div`
    height: 100vh;
    width: ${(props) => (props.showSidebar ? '20vw' : '0')};
    background-color: #161617;
    transition: all 0.3s ease;
    overflow: auto;
    padding: 1vh;

    @media (max-width: 768px) {
        width: 100vw;
        height: ${(props) => (props.showSidebar ? '40vh' : '0')};
        position: fixed;
        bottom: 0;
        left: 0;
        transform: translateY(${(props) => (props.showSidebar ? '0' : '100%')});
        z-index: 9999;
        transition: transform 0.3s ease;
    }
`;

const TradeItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    margin-bottom: 10px;
    background-color: #1f1f20;
    border-radius: 8px;
    transition: background-color 0.3s ease;
    cursor: pointer;
    
    &:hover {
        background-color: #29292a;
    }
`;

const TradeInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const TradeHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const TradeName = styled.h3`
    margin: 0;
    color: #fff;
    font-size: 2vh;
`;

const TradeDistance = styled.span`
    font-size: 1.6vh;
    color: #9d9d9f;
`;

const TradePrice = styled.p`
    font-size: 1.8vh;
    color: #e2e2e3;
    font-weight: bold;
    margin: 0.5vh 0;
`;

const TradeDescription = styled.p`
    color: #a7a7a8;
    font-size: 1.4vh;
    margin: 0;
`;

const IconWrapper = styled.div`
    color: #fff;
    font-size: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    
    &:hover {
        color: #48b1f4;
    }
`;

const Holder = styled.div`
    height: 1vh;
    width: 30%;
    background-color: #757575;
    border-radius: 2vh;
    margin: 1vh 0 2vh 0;
`;

const Trades = () => {
    const [socket, setSocket] = useState(null);
    const [trades, setTrades] = useState([]);
    const [map, setMap] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [productMarker, setProductMarker] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('urban_auth_token');
        const newSocket = io('http://localhost:8000', {
            transports: ['websocket'],
            auth: { token },
        });

        newSocket.on('connect', () => {
            console.log('Connected to the server', newSocket.id);
        });

        newSocket.on('tradesWithinRadius', (data) => {
            console.log('Trades within radius received:', data);
            setTrades(data);
            setShowSidebar(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from the server', newSocket.id);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [map]);

    useEffect(() => {
        const mapInstance = L.map('map', {
            center: [51.505, -0.09],
            zoom: 13,
            zoomControl: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
        }).addTo(mapInstance);

        setMap(mapInstance);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });
                    mapInstance.setView([latitude, longitude], 15);
                    L.marker([latitude, longitude])
                        .addTo(mapInstance)
                        .bindPopup('You are here!')
                        .openPopup();
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }

        return () => {
            mapInstance.remove();
        };
    }, []);

    const sendLocationUpdate = () => {
        if (userLocation && socket) {
            console.log('Sending location update:', userLocation);
            socket.emit('locationUpdate', userLocation);
        }
    };

    const handelShowOnMap = (coords) => {
        if (map) {
            const [longitude, latitude] = coords;

            if (productMarker) {
                map.removeLayer(productMarker);
                setProductMarker(null);
            }

            const newMarker = L.marker([latitude, longitude])
                .addTo(map)
                .openPopup();

            setProductMarker(newMarker);

            map.setView([latitude, longitude], 16, { animate: true, duration: 1 });
        }

        setShowSidebar(!showSidebar);
    };

    const userToProductDistanceCalc = (prodLat, prodLong) => {
        return calculateDistance(userLocation.latitude, userLocation.longitude, prodLat, prodLong).toFixed(2);
    };

    return (
        <Container>
            <Header>
                <Button
                    onClick={() => {
                        sendLocationUpdate();
                    }}
                >
                    <img src="/radar2.png" alt="Radar" />
                    <p style={{ marginLeft: '1vh' }}>Search Trades</p>
                </Button>
            </Header>
            <div style={{ display: 'flex' }}>
                <Sidebar showSidebar={showSidebar}>
                    <Holder></Holder>
                    <h2 style={{color: "white", padding: ".5vh 1vh 1.5vh 0"}}>Tradeable Items</h2>
                    {trades.map((trade) => (
                        <TradeItem key={trade._id}>
                            <TradeInfo>
                                <TradeHeader>
                                    <TradeName>{trade.name}</TradeName>
                                    <TradeDistance>• {userToProductDistanceCalc(trade.location.coordinates[1], trade.location.coordinates[0])} km</TradeDistance>
                                </TradeHeader>
                                <TradePrice>${trade.price}</TradePrice>
                                <TradeDescription>{trade.description}</TradeDescription>
                            </TradeInfo>
                            <IconWrapper title="Show on Map" onClick={() => handelShowOnMap(trade.location.coordinates)}>
                                <i className="fa-regular fa-map" />
                            </IconWrapper>
                        </TradeItem>
                    ))}
                </Sidebar>
                <div style={{ position: 'relative', width: '100%' }}>
                    <MapWrapper id="map" />
                    <ImageOverlay src="sidebar.svg" alt="" onClick={() => setShowSidebar(!showSidebar)} />
                </div>
            </div>
        </Container>
    );
};

export default Trades;
