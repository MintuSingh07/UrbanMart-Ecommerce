import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import styled from 'styled-components';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import calculateDistance from '../utility/calculateDistance';
import 'leaflet-routing-machine';

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

    @media (max-width: 1650px) {
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

    @media (max-width: 1650px) {
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

    @media (max-width: 1650px) {
        width: 100vw;
        height: ${(props) => (props.showSidebar ? '40vh' : '0')};
        position: fixed;
        bottom: 0;
        left: 0;
        transform: translateY(${(props) => (props.showSidebar ? '0' : '100%')});
        z-index: 9999;
        transition: transform 0.3s ease;
        border-top-left-radius: 1vh;
        border-top-right-radius: 1vh;
        padding: 1vh;
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
    height: .8vh;
    width: 25%;
    background-color: #757575;
    border-radius: 2vh;
    margin: .3vh 0 3vh 0;
`;

const DistanceIndicator = styled.div`
    position: absolute;
    height: 6vh;
    width: 40vw;
    z-index: 99;
    top: 95%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5vh;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4.6px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: white;
`

const Trades = () => {
    const [socket, setSocket] = useState(null);
    const [trades, setTrades] = useState([]);
    const [map, setMap] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [productMarker, setProductMarker] = useState(null);
    const [displayDistance, setDisplayDistance] = useState('');
    const [selectedProduct, setSelectedProduct] = useState({});

    //? HANDLE WEB-SOCKET REQUEST FOR TRADES
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

    //? HANDLE MAP MOUNTING & POINTERS
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

    //? CAPTURE AND SEND USER LOCATION TO SOCKET
    const sendLocationUpdate = () => {
        if (userLocation && socket) {
            console.log('Sending location update:', userLocation);
            socket.emit('locationUpdate', userLocation);
        }
    };

    //? HANDLE PRODUCT LOCATION ON MAP
    const handelShowOnMap = (coords, trade) => {
        if (map) {
            const [longitude, latitude] = coords;

            // Remove the previous marker if it exists
            if (productMarker) {
                map.removeLayer(productMarker);
                setProductMarker(null);
            }

            const newMarker = L.marker([latitude, longitude])
                .addTo(map)
                .openPopup();

            setProductMarker(newMarker);
            map.setView([latitude, longitude], 16, { animate: true, duration: 1 });

            // Remove the previous route if it exists
            if (map.routeControl) {
                map.removeControl(map.routeControl);
                map.routeControl = null;
            }

            // Calculate the route from the user's location to the product's location
            if (userLocation) {
                const userLatLng = [userLocation.latitude, userLocation.longitude];
                const productLatLng = [latitude, longitude];

                // Using Leaflet Routing Machine to calculate the path
                const routeControl = L.Routing.control({
                    waypoints: [
                        L.latLng(userLatLng),
                        L.latLng(productLatLng)
                    ],
                    routeWhileDragging: true,
                    lineOptions: { styles: [{ color: "green", weight: 4, className: 'animate' }] },
                    showAlternatives: false,
                    createMarker: () => null, // Disable the marker at each waypoint
                }).addTo(map);

                // Save the route control on the map object for future reference
                map.routeControl = routeControl;
            }

            const dist = calculateDistance(userLocation.latitude, userLocation.longitude, latitude, longitude).toFixed(2);
            setDisplayDistance(dist);
            setSelectedProduct(trade);
        }

        setShowSidebar(!showSidebar);
    };

    //? DISTANCE CALCULATOR
    const userToProductDistanceCalc = (prodLat, prodLong) => {
        return calculateDistance(userLocation.latitude, userLocation.longitude, prodLat, prodLong).toFixed(2);
    };

    //* (SOME UI PROBLEM SOLVE [IGNORE])
    useEffect(() => {
        const hideLeafletTopRight = () => {
            const elements = document.querySelectorAll('.leaflet-top.leaflet-right');
            elements.forEach((element) => {
                element.style.display = 'none';
            });
        };

        // Run once after component mounts
        hideLeafletTopRight();

        // Optional: If elements may be dynamically added, use MutationObserver
        const observer = new MutationObserver(hideLeafletTopRight);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
        };
    }, []);

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
                    {trades.length > 0 && <h2 style={{ color: "white", padding: "1vh 1vh 2vh .5vh" }}>Tradeable Items</h2>}
                    {trades.length === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', height: "100%", alignItems: "center", justifyContent: "center" }}>
                            <p style={{ color: "gray", textAlign: "center", padding: "1vh", fontSize: "2vh" }}>No trades available</p>
                            <p style={{ color: "gray", textAlign: "center", fontSize: "2vh" }}>Search for trades in your local</p>
                        </div>
                    ) : (
                        trades.map((trade) => (
                            <TradeItem key={trade._id}>
                                <TradeInfo>
                                    <TradeHeader>
                                        <TradeName>{trade.name}</TradeName>
                                        <TradeDistance>
                                            • {userToProductDistanceCalc(
                                                trade.location.coordinates[1],
                                                trade.location.coordinates[0]
                                            )}{" "}
                                            km
                                        </TradeDistance>
                                    </TradeHeader>
                                    <TradeDescription>
                                        {trade.description.length > 60
                                            ? `${trade.description.slice(0, 60)}...`
                                            : trade.description}
                                    </TradeDescription>

                                </TradeInfo>
                                <IconWrapper
                                    title="Show on Map"
                                    onClick={() => handelShowOnMap(trade.location.coordinates, trade)}
                                >
                                    <i className="fa-regular fa-map" />
                                </IconWrapper>
                            </TradeItem>
                        ))
                    )}
                </Sidebar>
                {displayDistance && <Sidebar showSidebar={!showSidebar}>
                    {selectedProduct &&
                        <>
                            {selectedProduct && (
                                <>
                                    <h1 style={{ color: "white", padding: ".5vh 1vh 2vh 1vh" }}>Details</h1>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "90%", margin: "0 auto", gap: "2vh" }}>
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative", width: "100%", height: "20vh", marginTop: "-8%" }}>
                                            {/* Left Image */}
                                            <div style={{ width: "70%", height: "15vh", backgroundColor: "black", borderRadius: "1vh", overflow: "hidden", position: "absolute", left: "0%", bottom: "0", zIndex: 0 }}>
                                                <img loading='lazy' src={selectedProduct.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "1vh", filter: "contrast(100%) brightness(0.6)" }} />
                                            </div>

                                            {/* Right Image */}
                                            <div style={{ width: "70%", height: "15vh", backgroundColor: "black", borderRadius: "1vh", overflow: "hidden", position: "absolute", right: "0%", bottom: "0", zIndex: 0, }} >
                                                <img loading='lazy' src={selectedProduct.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "1vh", filter: "contrast(100%) brightness(0.6)" }} />
                                            </div>

                                            {/* Center Image */}
                                            <div style={{ width: "70%", height: "17vh", backgroundColor: "black", borderRadius: "1vh", overflow: "hidden", position: "absolute", zIndex: 1, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)", top: "20%" }} >
                                                <img loading='lazy' src={selectedProduct.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "1vh", }} />
                                            </div>
                                        </div>

                                        {/* Text details */}
                                        <div style={{ marginTop: "2vh" }}>
                                            <h2 style={{ margin: "0", fontSize: "3vh", color: "#ffffff" }}>{selectedProduct.name}</h2>
                                            <p style={{ fontSize: "1.7vh", color: "#a7a7a8", margin: "1vh 0" }}>
                                                {selectedProduct.description}
                                            </p>
                                        </div>

                                        {/* product Usage Details */}
                                        <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>

                                            {/* Years Old */}
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                <h1 style={{ color: "white", marginBottom: ".5vh", fontWeight: "500" }}>1.5</h1>
                                                <p style={{ color: "#a7a7a8" }}>Year(s) Old</p>
                                            </div>

                                            {/* Condition */}
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                <h1 style={{ color: "white", marginBottom: ".5vh", fontWeight: "500" }}>Good</h1>
                                                <p style={{ color: "#a7a7a8" }}>Condition</p>
                                            </div>
                                        </div>

                                        {/* Trade Button */}
                                        <button style={{ padding: "1.5vh", width: '100%', borderRadius: ".5vh", cursor: "pointer", margin: "1vh 0" }}>Request Trade</button>
                                    </div>
                                </>
                            )}
                        </>

                    }
                </Sidebar>}
                <div style={{ position: 'relative', width: '100%' }}>
                    <MapWrapper id="map" />
                    <ImageOverlay src="sidebar.svg" alt="" onClick={() => setShowSidebar(!showSidebar)} />
                </div>
                {displayDistance &&
                    <DistanceIndicator>
                        <h4 style={{ marginBottom: ".3vh" }}>Trade is within</h4>
                        <p>{displayDistance} km</p>
                    </DistanceIndicator>
                }
            </div>
        </Container>
    );
};

export default Trades;
