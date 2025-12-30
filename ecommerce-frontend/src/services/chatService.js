import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

class UserChatService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.currentToken = null;
  }

  connect(token) {
    this.currentToken = token;

    return new Promise((resolve, reject) => {
      try {
        const wsUrl = import.meta.env.VITE_WS_URL;
        console.log("Connecting to WebSocket:", wsUrl);

        const socket = new SockJS(wsUrl);
        this.stompClient = Stomp.over(socket);

        // Tắt debug log trong production
        this.stompClient.debug = (str) => {
          if (import.meta.env.DEV) {
            console.log("STOMP:", str);
          }
        };

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        this.stompClient.connect(
          headers,
          (frame) => {
            console.log("WebSocket connected:", frame);
            this.connected = true;
            this.reconnectAttempts = 0;
            resolve(this.stompClient);
          },
          (error) => {
            console.error("WebSocket connection error:", error);
            this.connected = false;
            this.handleReconnect();
            reject(error);
          }
        );

        // Xử lý disconnect
        this.stompClient.onWebSocketClose = () => {
          console.log("WebSocket disconnected");
          this.connected = false;
          this.handleReconnect();
        };
      } catch (error) {
        console.error("Error creating WebSocket connection:", error);
        reject(error);
      }
    });
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );

      setTimeout(() => {
        if (this.currentToken) {
          this.connect(this.currentToken).catch((error) => {
            console.error("Reconnection failed:", error);
          });
        }
      }, this.reconnectDelay);
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  // Subscribe to room messages
  subscribeToRoom(roomId, callback) {
    if (!this.stompClient || !this.connected) {
      console.error("WebSocket not connected");
      return null;
    }

    const destination = `/topic/chat/${roomId}`;

    try {
      const subscription = this.stompClient.subscribe(
        destination,
        (message) => {
          try {
            const messageData = JSON.parse(message.body);
            console.log("Received message:", messageData);
            callback(messageData);
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        }
      );

      this.subscriptions.set(`room-${roomId}`, subscription);
      console.log(`Subscribed to room ${roomId}`);
      return subscription;
    } catch (error) {
      console.error("Subscribe error:", error);
      return null;
    }
  }

  // Subscribe to read status updates
  subscribeToReadStatus(roomId, callback) {
    if (!this.stompClient || !this.connected) {
      console.error("WebSocket not connected");
      return null;
    }

    const destination = `/topic/chat/${roomId}/read`;

    try {
      const subscription = this.stompClient.subscribe(
        destination,
        (message) => {
          try {
            const userId = JSON.parse(message.body);
            console.log("Messages read by user:", userId);
            callback(userId);
          } catch (error) {
            console.error("Error parsing read status:", error);
          }
        }
      );

      this.subscriptions.set(`read-${roomId}`, subscription);
      console.log(`Subscribed to read status for room ${roomId}`);
      return subscription;
    } catch (error) {
      console.error("Subscribe to read status error:", error);
      return null;
    }
  }

  // Unsubscribe from a destination
  unsubscribe(key) {
    const subscription = this.subscriptions.get(key);
    if (subscription) {
      try {
        subscription.unsubscribe();
        this.subscriptions.delete(key);
        console.log(`Unsubscribed from ${key}`);
      } catch (error) {
        console.error(`Error unsubscribing from ${key}:`, error);
      }
    }
  }

  // Unsubscribe from all
  unsubscribeAll() {
    this.subscriptions.forEach((subscription, key) => {
      try {
        subscription.unsubscribe();
        console.log(`Unsubscribed from ${key}`);
      } catch (error) {
        console.error(`Error unsubscribing from ${key}:`, error);
      }
    });
    this.subscriptions.clear();
    console.log("All subscriptions cleared");
  }

  // Disconnect
  disconnect() {
    if (this.stompClient) {
      this.unsubscribeAll();
      this.currentToken = null;

      try {
        this.stompClient.disconnect(() => {
          console.log("WebSocket disconnected gracefully");
          this.connected = false;
          this.reconnectAttempts = 0;
        });
      } catch (error) {
        console.error("Error disconnecting:", error);
      }
    }
  }

  isConnected() {
    return this.connected;
  }

  resetReconnectAttempts() {
    this.reconnectAttempts = 0;
  }
}

const userChatService = new UserChatService();
export default userChatService;
