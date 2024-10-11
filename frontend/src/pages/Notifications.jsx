import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { jwtDecode } from 'jwt-decode';

// Container for the whole page
const Container = styled.div`
  padding: 20px;
  width: 100%;
  min-height: 93.8vh;
  margin: 0 auto;
`;

// Header for the notifications page
const Header = styled.h1`
  font-size: 3vh;
  margin-bottom: 20px;
  text-align: left;
  color: white;
`;

// Individual notification item
const NotificationItem = styled.div`
  border-bottom: 1px solid #ddd;
  padding-bottom: 2vh;
  margin: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
`;

// Message text within each notification
const Message = styled.p`
  margin: 0;
  font-size: 1.1rem;
  color: #ffffff;
  line-height: 2.6vh;
`;

// No notifications message
const NoNotifications = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #ffffff;
`;

// Styled component for the notification indicator
const NotificationIndicator = styled.div`
  height: 6vh;
  width: 6vh;
  background-color: grey;
  border-radius: 50%;
  margin-right: 1.5vh;

  @media (max-width: 768px) {
    height: 5vh;
    width: 7vh;
  }
`;

const AcceptBtn = styled.button`
    padding: .5vh 1.5vh;
    border-radius: .5vh;
    border: 0;
    outline: 0;

    &:active {
      scale: .95;
    }
`;

const DeclineBtn = styled.button`
    padding: .5vh 1.5vh;
    background-color: transparent;
    color: white;
    border: 1px solid white;
    border-radius: .5vh;
    outline: 0;

    &:active {
      scale: .95;
    }
`;

const Notifications = () => {
  const [resNotifications, setResNotifications] = useState([]);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('urban_auth_token');
    setToken(token);

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
        fetchNotifications(decodedToken.id, token);
      } catch (error) {
        console.error('Error decoding token:', error);
        setLoading(false);
      }
    } else {
      console.warn('No token found in local storage');
      setLoading(false);
    }
  }, []);

  const fetchNotifications = async (userId, token) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/notifications',
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data.Notifications);
      setResNotifications(response.data.Notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const DeclineBtnFunc = async (notificationId) => {
    console.log('Removed message');
    try {
      const response = await axios.delete('http://localhost:8000/trades/delete-notification', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: {
          notificationId,
          userId
        }
      });
      console.log(response.data);
      fetchNotifications(userId, token);
    } catch (error) {
      console.log(error);
    }
  };

  const timeAgo = (date) => {
    const now = new Date();
    const requestDate = new Date(date);
    const timeDiff = now - requestDate;

    const minutes = Math.floor(timeDiff / (1000 * 60));
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  };

  const splitMessage = (message) => {
    const match = message.match(/^(.*?) wants to trade (.*?) for your (.*)$/);
    if (match) {
      return { sender: match[1], item1: match[2], item2: match[3] };
    }
    return { sender: message, item1: '', item2: '' };
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <Header>Notifications</Header>
      {resNotifications.length === 0 ? (
        <NoNotifications>No notifications available.</NoNotifications>
      ) : (
        resNotifications.map((notification) => {
          const { sender, item1, item2 } = splitMessage(notification.message);
          return (
            <NotificationItem key={notification._id}>
              <NotificationIndicator />
              <div>
                <Message>
                  <strong>{sender}</strong> wants to trade <strong>{item1}</strong> for your <strong>{item2}</strong>
                </Message>
                <p style={{ color: "#cdcdcd", marginTop: ".5vh" }}>
                  {timeAgo(notification.createdAt)}
                </p>
                <div style={{ marginTop: "2vh", display: "flex", columnGap: "1vh" }}>
                  <AcceptBtn>Accept</AcceptBtn>
                  <DeclineBtn onClick={() => DeclineBtnFunc(notification._id)}>Decline</DeclineBtn>
                </div>
              </div>
            </NotificationItem>
          );
        })
      )}
    </Container>
  );
};

export default Notifications;
