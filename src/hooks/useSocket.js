import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const useSocket = () => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socket = io(BACKEND_URL, {
            transports: ['websocket'],
            autoConnect: true,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to signaling server');
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from signaling server');
            setIsConnected(false);
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    return {
        socket: socketRef.current,
        isConnected,
    };
};
