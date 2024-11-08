// import React, { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';
// import styled from 'styled-components';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';

// const Container = styled.div`
//     padding: 20px;
//     position: relative;
// `;

// const Header = styled.div`
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     margin-bottom: 20px;
//     flex-wrap: wrap;
// `;

// const Title = styled.h1`
//     margin: 0;
// `;

// const Button = styled.button`
//     padding: 10px 20px;
//     font-size: 16px;
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//     background-color: #ffffff;
//     border: 1px solid black;
//     outline: 0;
//     border-radius: 1vh;
// `;

// const TradesList = styled.div`
//     display: flex;
//     flex-wrap: wrap;
//     gap: 20px;
// `;

// const CardContainer = styled.div`
//     width: 20vw;
//     padding: 1vh;
//     border-radius: 1vh;
//     cursor: pointer;
//     position: relative;
//     transition: transform 0.3s;

//     @media (max-width: 768px) {
//         width: 95vw;
//     }

//     @media (max-width: 480px) {
//         width: 95vw;
//     }
// `;

// const ProductImage = styled.img`
//     width: 100%;
//     height: 25vh;
//     object-fit: cover;
//     border-radius: 0.5vh;
// `;

// const CardContent = styled.div`
//     padding: 1vh;
//     position: relative;
// `;

// const CardTitle = styled.h2`
//     font-weight: 500;
//     font-size: 2.5vh;
// `;

// const CardPrice = styled.p`
//     font-size: 1.5rem;
//     color: #000;
//     margin: 0.5rem 0;
//     font-weight: 600;
// `;

// const Rating = styled.p`
//     font-size: 0.9rem;
//     color: #555;
//     margin: 0;
// `;

// const CardDescription = styled.p`
//     font-size: 1rem;
//     color: #333;
//     margin-bottom: 1vh;
//     margin-top: 0.5vh;
// `;

// const TradeButton = styled.button`
//     padding: 10px 20px;
//     width: 100%;
//     font-size: 2vh;
//     cursor: pointer;
//     background-color: #007bff;
//     color: white;
//     border: none;
//     border-radius: 4px;
//     display: flex;
//     align-items: center;
//     justify-content: center;

//     img {
//         height: 2.5vh;
//         margin-right: 1vh;
//     }
// `;

// const SelfTrades = styled.div`
//     height: 25vh;
//     width: 50%;
//     padding: 1vh;
//     background-color: #b5b5b5;
//     position: fixed;
//     bottom: ${(props) => (props.isVisible ? '0%' : '-100%')}; /* Change bottom based on visibility */
//     left: 50%;
//     transform: translate(-50%, 0%);
//     transition: all 0.5s linear; /* Shorter transition for smoother animation */
//     overflow: auto;
// `;

// const TradeItem = styled.div`
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     padding: 1vh;
// `;

// const Checkbox = styled.input.attrs({ type: 'checkbox' })`
//     width: 2vh;
//     height: 2vh;
// `;

// const Trades = () => {
//     const [socket, setSocket] = useState(null);
//     const [trades, setTrades] = useState([]);
//     const [isSelfTradesVisible, setIsSelfTradesVisible] = useState(false);
//     const [myTrades, setMyTrades] = useState([]);
//     const [selectedTrade, setSelectedTrade] = useState(null);
//     const [selectedMyTrade, setSelectedMyTrade] = useState(null);

//     useEffect(() => {
//         const token = localStorage.getItem('urban_auth_token');
//         const newSocket = io('http://localhost:8000', {
//             transports: ['websocket'],
//             auth: { token }
//         });

//         newSocket.on('connect', () => {
//             console.log('Connected to the server', newSocket.id);
//         });

//         newSocket.on('locationUpdate', (data) => {
//             console.log('Location update received:', data);
//         });

//         newSocket.on('tradesWithinRadius', (data) => {
//             console.log('Trades within radius received:', data);
//             setTrades(data);
//         });

//         newSocket.on('disconnect', () => {
//             console.log('Disconnected from the server', newSocket.id);
//         });

//         setSocket(newSocket);

//         return () => {
//             newSocket.disconnect();
//         };
//     }, []);

//     const sendLocationUpdate = () => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const locationData = {
//                         latitude: position.coords.latitude,
//                         longitude: position.coords.longitude
//                     };
//                     if (socket) {
//                         console.log('Sending location update:', locationData);
//                         socket.emit('locationUpdate', locationData);
//                     }
//                 },
//                 (error) => {
//                     console.error('Error getting location:', error);
//                 }
//             );
//         } else {
//             console.error('Geolocation is not supported by this browser.');
//         }
//     };

//     const handleMyTrades = async () => {
//         setIsSelfTradesVisible(!isSelfTradesVisible);
//         if (isSelfTradesVisible === false) {
//             const token = localStorage.getItem('urban_auth_token');
//             const { id } = jwtDecode(token);
//             console.log(id);

//             try {
//                 const response = await axios.post('http://localhost:8000/trades/my-trades', {
//                     userId: id
//                 }, {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 });
//                 setMyTrades(response.data.myItems);
//                 console.log(myTrades);
//             } catch (error) {
//                 console.error('Error fetching my trades:', error);
//             }
//         }
//     };

//     const handleCheckboxChange = (index) => {
//         setSelectedMyTrade(index);
//     };

//     const handleTradeButtonClick = (index) => {
//         setSelectedTrade(index);
//         handleMyTrades();
//     };

//     const handleRequestTrade = async () => {
//         const selectedTradeItem = trades[selectedTrade];
//         const selectedMyTradeItem = myTrades[selectedMyTrade];

//         if (selectedTradeItem && selectedMyTradeItem) {
//             try {
//                 const token = localStorage.getItem('urban_auth_token');
//                 const response = await axios.post('http://localhost:8000/trades/request-trade', {
//                     tradeItem: selectedTradeItem,
//                     myTradeItem: selectedMyTradeItem
//                 }, {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 });

//                 console.log('Trade request sent:', response.data);
//             } catch (error) {
//                 console.error('Error sending trade request:', error);
//             }
//         } else {
//             console.error('Please select a trade item and one of your trades.');
//         }
//     };

//     return (
//         <Container>
//             <Header>
//                 <Title>Trades</Title>
//                 <Button onClick={sendLocationUpdate}>
//                     <img src="/radar2.png" alt="Radar" />
//                     <p style={{ marginLeft: "1vh" }}>Search Trades</p>
//                 </Button>
//             </Header>
//             <h2 style={{ marginBottom: "2vh" }}>Trades within 5 KM</h2>
//             <TradesList>
//                 {trades.length > 0 ? (
//                     trades.map((trade, index) => (
//                         <CardContainer key={index}>
//                             <ProductImage src={trade.image} alt={trade.name} loading='lazy' />
//                             <CardContent>
//                                 <Link style={{ textDecoration: "none", color: "black" }} to={`/trade/${trade._id}`}>
//                                     <CardTitle>{trade.name.length > 53 ? `${trade.name.substring(0, 53)}...` : trade.name}</CardTitle>
//                                 </Link>
//                                 <CardDescription>{trade.description}</CardDescription>
//                                 <p>Posted By:- {trade.user.userName}</p>
//                                 <CardPrice>Price: ${trade.price}</CardPrice>
//                                 <TradeButton onClick={() => handleTradeButtonClick(index)}>
//                                     <img src="/trade.png" alt="Trade" />
//                                     Trade
//                                 </TradeButton>
//                             </CardContent>
//                         </CardContainer>
//                     ))
//                 ) : (
//                     <p>No trades available nearby. Search for trades.</p>
//                 )}
//             </TradesList>
//             <SelfTrades isVisible={isSelfTradesVisible}>
//                 <div style={{ display: "flex", justifyContent: "space-between" }}>
//                     <h1>Your Trades</h1>
//                     <button onClick={handleRequestTrade}>Request</button>
//                 </div>
//                 {myTrades.map((item, i) => (
//                     <TradeItem key={i}>
//                         <div>
//                             <p style={{ fontWeight: "500", fontSize: "2.5vh", marginBottom: ".5vh" }}>{item.name}</p>
//                             <p>{item.description}</p>
//                         </div>
//                         <Checkbox
//                             checked={selectedMyTrade === i}
//                             onChange={() => handleCheckboxChange(i)}
//                         />
//                     </TradeItem>
//                 ))}
//             </SelfTrades>
//         </Container>
//     );
// };

// export default Trades;

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import styled from 'styled-components';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
    top: 4vh;
`;

const MapWrapper = styled.div`
    height: 100%;
    width: 100%;
    position: relative;
    z-index: 1;
    background-color: #161617;
`;

const ImageOverlay = styled.img`
    position: absolute;
    top: 3vh;
    left: 2vh;
    z-index: 10;
    height: 4vh;
`;

const Sidebar = styled.div`
    height: 100vh;
    width: ${(props) => (props.showSidebar ? '20vw' : '0')};
    background-color: white;
    transition: width 0.3s ease;
    overflow: hidden;
`;

const TradeItem = styled.div`
    padding: 10px;
    border-bottom: 1px solid #ddd;
`;

const Trades = () => {
    const [socket, setSocket] = useState(null);
    const [trades, setTrades] = useState([]);
    const [map, setMap] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);

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

                    mapInstance.setView([latitude, longitude], 17);
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
        if(map){
            const longitude = coords[0]
            const latitude = coords[1]

            L.marker([latitude, longitude])
                .addTo(map)
                .bindPopup("hi")
        }
    }

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
                    {trades.map((trade) => (
                        <TradeItem key={trade._id}>
                            <h3>{trade.name}</h3>
                            <p>{trade.description}</p>
                            <p>Price: ${trade.price}</p>
                            <button onClick={()=> handelShowOnMap(trade.location.coordinates)}>On Map</button>
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