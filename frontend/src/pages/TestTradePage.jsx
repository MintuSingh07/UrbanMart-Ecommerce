import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import L from 'leaflet'; // Import Leaflet
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const TestTradePage = () => {
    const [map, setMap] = useState(null); // State for Leaflet map
    const [trades, setTrades] = useState([]); // State for trades within radius
    const [socket, setSocket] = useState(null); // Socket for real-time updates
    const [location, setLocation] = useState(null); // State for current location

    useEffect(() => {
        // Initialize Leaflet map
        const mapInstance = L.map('map').setView([51.505, -0.09], 13); // Default view (London)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(mapInstance);

        setMap(mapInstance); // Save map instance to state

        // Set up WebSocket connection
        const token = localStorage.getItem('urban_auth_token');
        const newSocket = io('http://localhost:8000', {
            transports: ['websocket'],
            auth: { token }
        });

        newSocket.on('connect', () => {
            console.log('Connected to the server', newSocket.id);
        });

        newSocket.on('tradesWithinRadius', (data) => {
            console.log('Trades within radius received:', data);
            setTrades(data);
        });

        setSocket(newSocket);

        // Cleanup map and socket on unmount
        return () => {
            mapInstance.remove();
            newSocket.disconnect();
        };
    }, []);

    // Function to get and mark user location
    const markUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude }); // Update location state

                    // Update map view to current location and add marker
                    if (map) {
                        map.setView([latitude, longitude], 17);
                        L.marker([latitude, longitude]).addTo(map)
                            .bindPopup('You are here!')
                            .openPopup();
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

    // Function to fetch trades within 5 km radius
    const fetchTradesWithinRadius = async () => {
        if (location) {
            try {
                const token = localStorage.getItem('urban_auth_token');
                const response = await axios.post('http://localhost:8000/trades/nearby', {
                    latitude: location.latitude,
                    longitude: location.longitude
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                setTrades(response.data.trades); // Assuming the response contains a trades array
                console.log('Trades requested:', response.data.trades);

                // Clear existing markers
                map.eachLayer((layer) => {
                    if (layer instanceof L.Marker) {
                        map.removeLayer(layer);
                    }
                });

                // Add new trade markers to the map
                response.data.trades.forEach((trade) => {
                    L.marker([trade.latitude, trade.longitude]) // Assuming trade has latitude and longitude
                        .addTo(map)
                        .bindPopup(`${trade.name}: $${trade.price}`); // Customize popup as needed
                });

            } catch (error) {
                console.error('Error fetching trades:', error);
            }
        } else {
            console.error('Location is not set. Please get your location first.');
        }
    };

    // Call markUserLocation on component mount
    useEffect(() => {
        markUserLocation();
    }, []);

    return (
        <div>
            <button onClick={fetchTradesWithinRadius} style={{ marginBottom: '20px', padding: '10px 20px' }}>
                Search Trades
            </button>
            {/* Map container */}
            <div id="map" style={{ height: '100vh', width: '100%' }}></div>
        </div>
    );
};

export default TestTradePage;
