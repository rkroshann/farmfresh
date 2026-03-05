import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import useStore from '../store/useStore';

const SocketContext = createContext();

const SOCKET_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user, isAuthenticated } = useStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect to socket
      const newSocket = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
        // Join with user ID
        newSocket.emit('join', user.id || user._id);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else if (socket) {
      socket.disconnect();
      setSocket(null);
      setConnected(false);
    }
  }, [isAuthenticated, user]);

  const joinChat = (chatId) => {
    if (socket && connected) {
      socket.emit('join_chat', chatId);
    }
  };

  const sendMessage = (chatId, message) => {
    if (socket && connected) {
      socket.emit('send_message', { chatId, message });
    }
  };

  const onReceiveMessage = (callback) => {
    if (socket) {
      socket.on('receive_message', callback);
    }
  };

  const onNewMessageNotification = (callback) => {
    if (socket) {
      socket.on('new_message_notification', callback);
    }
  };

  const emitTyping = (chatId, isTyping) => {
    if (socket && connected) {
      socket.emit('typing', { chatId, userId: user?.id || user?._id, isTyping });
    }
  };

  const onUserTyping = (callback) => {
    if (socket) {
      socket.on('user_typing', callback);
    }
  };

  const value = {
    socket,
    connected,
    joinChat,
    sendMessage,
    onReceiveMessage,
    onNewMessageNotification,
    emitTyping,
    onUserTyping
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
