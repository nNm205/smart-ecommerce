import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

class ChatService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
  }

  connect(token) {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = import.meta.env.VITE_WS_URL;
        const socket = new SockJS(wsUrl);
        this.stompClient = Stomp.over(socket);

        // Tắt debug log trong production
        this.stompClient.debug = (str) => {
          if (import.meta.env.DEV) {
            console.log(str);
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
            this.handleReconnect(token);
            reject(error);
          }
        );

        // Xử lý disconnect
        this.stompClient.onWebSocketClose = () => {
          console.log("WebSocket disconnected");
          this.connected = false;
          this.handleReconnect(token);
        };
      } catch (error) {
        console.error("Error creating WebSocket connection:", error);
        reject(error);
      }
    });
  }

  handleReconnect(token) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );

      setTimeout(() => {
        this.connect(token).catch((error) => {
          console.error("Reconnection failed:", error);
        });
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
    const subscription = this.stompClient.subscribe(destination, (message) => {
      try {
        const messageData = JSON.parse(message.body);
        callback(messageData);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    this.subscriptions.set(`room-${roomId}`, subscription);
    console.log(`Subscribed to room ${roomId}`);
    return subscription;
  }

  // Subscribe to new messages notification for admin
  subscribeToAdminNotifications(callback) {
    if (!this.stompClient || !this.connected) {
      console.error("WebSocket not connected");
      return null;
    }

    const destination = "/topic/admin/new-message";
    const subscription = this.stompClient.subscribe(destination, (message) => {
      try {
        const messageData = JSON.parse(message.body);
        callback(messageData);
      } catch (error) {
        console.error("Error parsing notification:", error);
      }
    });

    this.subscriptions.set("admin-notifications", subscription);
    console.log("Subscribed to admin notifications");
    return subscription;
  }

  // Subscribe to read status updates
  subscribeToReadStatus(roomId, callback) {
    if (!this.stompClient || !this.connected) {
      console.error("WebSocket not connected");
      return null;
    }

    const destination = `/topic/chat/${roomId}/read`;
    const subscription = this.stompClient.subscribe(destination, (message) => {
      try {
        const userId = JSON.parse(message.body);
        callback(userId);
      } catch (error) {
        console.error("Error parsing read status:", error);
      }
    });

    this.subscriptions.set(`read-${roomId}`, subscription);
    return subscription;
  }

  // Unsubscribe from a destination
  unsubscribe(key) {
    const subscription = this.subscriptions.get(key);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(key);
      console.log(`Unsubscribed from ${key}`);
    }
  }

  // Unsubscribe from all
  unsubscribeAll() {
    this.subscriptions.forEach((subscription, key) => {
      subscription.unsubscribe();
      console.log(`Unsubscribed from ${key}`);
    });
    this.subscriptions.clear();
  }

  // Send message via WebSocket (if needed)
  sendMessage(destination, message) {
    if (!this.stompClient || !this.connected) {
      console.error("WebSocket not connected");
      return false;
    }

    try {
      this.stompClient.send(destination, {}, JSON.stringify(message));
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    }
  }

  // Disconnect
  disconnect() {
    if (this.stompClient) {
      this.unsubscribeAll();
      this.stompClient.disconnect(() => {
        console.log("WebSocket disconnected");
        this.connected = false;
      });
    }
  }

  isConnected() {
    return this.connected;
  }
}

export default new ChatService();
