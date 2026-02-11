import { io } from 'socket.io-client';

const SOCKET_URL = __DEV__
    ? 'http://192.168.1.196:3001'
    : 'https://connectly-socket-server.onrender.com';

let socket;

export const connectSocket = (token) => {
    socket = io(SOCKET_URL, {
        transports: ['websocket'],
    });

    socket.emit('join', token);
};

export const joinChatRoom = (chatId) => {
    socket.emit('join-chat', chatId);
};

export const sendSocketMessage = (chatId, text) => {
    socket.emit('send-message', { chatId, text });
};

export const onNewMessage = (callback) => {
    socket.on('new-message', callback);
};

export const disconnectSocket = () => {
    if (socket) socket.disconnect();
};
