import React, { createContext, useContext, useEffect, useState } from "react";
import { initSocket, disconnectSocket, getSocket, subscribeToEvent, emitEvent } from "../libs/socket";

const SocketContext = createContext(null);

/**
 * Socket Provider - Wrap your app with this to enable socket functionality
 */
export const SocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        // Only connect if user is authenticated
        if (token) {
            const socketInstance = initSocket();
            setSocket(socketInstance);

            socketInstance.on("connect", () => {
                setIsConnected(true);
            });

            socketInstance.on("disconnect", () => {
                setIsConnected(false);
            });
        }

        // Cleanup on unmount
        return () => {
            disconnectSocket();
        };
    }, []);

    const value = {
        socket,
        isConnected,
        emit: emitEvent,
        subscribe: subscribeToEvent,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

/**
 * Custom hook to use socket in components
 * @returns {{ socket: Socket, isConnected: boolean, emit: Function, subscribe: Function }}
 */
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};

export default SocketContext;
