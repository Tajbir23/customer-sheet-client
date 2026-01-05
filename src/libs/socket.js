import { io } from "socket.io-client";

// Socket server URL (same as API but without /api path)
const SOCKET_URL = "https://customer-sheet-server-production.up.railway.app";
// const SOCKET_URL = "http://localhost:5000";

let socket = null;

/**
 * Initialize socket connection with auth token
 * @returns {Socket} Socket instance
 */
export const initSocket = () => {
    if (socket?.connected) {
        return socket;
    }

    const token = localStorage.getItem("token");

    socket = io(SOCKET_URL, {
        auth: {
            token: token,
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
        console.log("🔌 Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
        console.log("🔌 Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
        console.error("🔌 Socket connection error:", error.message);
    });

    return socket;
};

/**
 * Get the current socket instance
 * @returns {Socket|null} Socket instance or null
 */
export const getSocket = () => socket;

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

/**
 * Emit an event to the server
 * @param {string} event - Event name
 * @param {any} data - Data to send
 */
export const emitEvent = (event, data) => {
    if (socket?.connected) {
        socket.emit(event, data);
    } else {
        console.warn("Socket not connected. Cannot emit:", event);
    }
};

/**
 * Subscribe to an event
 * @param {string} event - Event name
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export const subscribeToEvent = (event, callback) => {
    if (socket) {
        socket.on(event, callback);
        // Return unsubscribe function
        return () => socket.off(event, callback);
    }
    return () => { };
};

export default socket;
