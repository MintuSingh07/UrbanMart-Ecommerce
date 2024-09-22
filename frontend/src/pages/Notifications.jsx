import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { jwtDecode } from 'jwt-decode'; // Correct import statement

// Container for the whole page
const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

// Header for the notifications page
const Header = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
`;

// Individual notification item
const NotificationItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin: 10px 0;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

// Message text within each notification
const Message = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #333;
`;

// No notifications message
const NoNotifications = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
`;

const Notifications = () => {
  const [resNotifications, setResNotifications] = useState([]);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    // Retrieve user ID from local storage and decode the token
    const token = localStorage.getItem('urban_auth_token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);

        // Fetch notifications from the API
        const fetchNotifications = async () => {
          try {
            const response = await axios.post(
              'http://localhost:8000/notifications',
              { userId: decodedToken.id },
              {
                headers: {
                  Authorization: `Bearer ${token}` // Add the Bearer token to the headers
                }
              }
            );
            console.log(response.data.Notifications); // Log the Notifications array
            setResNotifications(response.data.Notifications || []); // Ensure `resNotifications` is always an array
          } catch (error) {
            console.error('Error fetching notifications:', error);
          } finally {
            setLoading(false); // Set loading to false after fetching
          }
        };

        fetchNotifications();
      } catch (error) {
        console.error('Error decoding token:', error);
        setLoading(false); // Set loading to false even if token decoding fails
      }
    } else {
      console.warn('No token found in local storage');
      setLoading(false); // Set loading to false if no token is found
    }
  }, []); // Ensure the dependency array is empty to only run on mount

  if (loading) {
    return <p>Loading...</p>; // Provide feedback while loading
  }

  return (
    <Container>
      <Header>Notifications</Header>
      {resNotifications.length === 0 ? (
        <NoNotifications>No notifications available.</NoNotifications>
      ) : (
        resNotifications.map((notification) => (
          <NotificationItem key={notification._id}>
            <Message>{notification.message}</Message>
            <p>Type: {notification.type}</p>
            <p>Created At: {new Date(notification.createdAt).toLocaleDateString()}</p>
          </NotificationItem>
        ))
      )}
    </Container>
  );
};

export default Notifications;
