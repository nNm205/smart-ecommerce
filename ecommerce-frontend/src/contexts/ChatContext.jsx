import { createContext, useState, useEffect, useCallback, useRef } from "react";
import userChatService from "../services/chatService";
import {
  getMyRoom,
  getRoomMessages,
  sendMessage as sendMessageApi,
  markMessagesAsRead,
} from "../services/chatApi";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // State
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Refs
  const userIdRef = useRef(null);
  const isPageVisibleRef = useRef(true);
  const hasSubscribedRef = useRef(false); // Track subscription status

  const getUserInfo = useCallback(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error("Error parsing user info:", e);
        return null;
      }
    }
    return null;
  }, []);

  const getToken = useCallback(() => {
    return localStorage.getItem("accessToken");
  }, []);

  const initializeChat = useCallback(async () => {
    const token = getToken();
    const user = getUserInfo();

    if (!token || !user) {
      setError("Vui lòng đăng nhập để sử dụng chat");
      setIsLoading(false);
      return false;
    }

    userIdRef.current = user.userId;

    try {
      setIsLoading(true);
      setError(null);

      console.log("Getting or creating room...");
      const roomData = await getMyRoom();
      console.log("Room data:", roomData);
      setRoom(roomData);

      console.log("Loading messages for room:", roomData.id);
      const msgs = await getRoomMessages(roomData.id);
      console.log("Loaded messages:", msgs.length);

      const formattedMessages = msgs.map((msg) => ({
        ...msg,
        isSent: msg.senderId === user.userId,
        type: "message",
      }));

      setMessages(formattedMessages);

      const unread = msgs.filter(
        (msg) => msg.senderId !== user.userId && !msg.isRead
      ).length;
      setUnreadCount(unread);

      setIsLoading(false);
      return roomData;
    } catch (err) {
      console.error("Error initializing chat:", err);
      setError("Không thể tải phòng chat");
      setIsLoading(false);
      return false;
    }
  }, [getToken, getUserInfo]);

  const connectWebSocket = useCallback(async () => {
    const token = getToken();
    const user = getUserInfo();

    if (!token || !user) {
      setError("Vui lòng đăng nhập để kết nối chat");
      return false;
    }

    if (isConnecting || isConnected) {
      console.log("Already connecting or connected");
      return true;
    }

    setIsConnecting(true);
    setError(null);

    try {
      console.log("Connecting to WebSocket...");
      await userChatService.connect(token);
      setIsConnected(true);
      setIsConnecting(false);
      console.log("WebSocket connected successfully");
      return true;
    } catch (err) {
      console.error("WebSocket connection error:", err);
      setIsConnected(false);
      setIsConnecting(false);
      setError("Không thể kết nối WebSocket");
      return false;
    }
  }, [getToken, getUserInfo, isConnecting, isConnected]);

  const sendMessage = useCallback(
    async (content, messageType = "TEXT") => {
      if (!content.trim()) return null;
      if (!room) {
        setError("Phòng chat chưa được khởi tạo");
        return null;
      }

      try {
        const messageData = {
          roomId: room.id,
          content: content.trim(),
          messageType,
        };

        console.log("Sending message:", messageData);
        const sentMessage = await sendMessageApi(messageData);
        console.log("Message sent successfully:", sentMessage);

        // Add message immediately to UI
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === sentMessage.id);
          if (exists) return prev;

          return [
            ...prev,
            {
              ...sentMessage,
              isSent: true,
              type: "message",
            },
          ];
        });

        return sentMessage;
      } catch (err) {
        console.error("Error sending message:", err);
        setError(err.message || "Không thể gửi tin nhắn");
        throw err;
      }
    },
    [room]
  );

  const markAsRead = useCallback(async () => {
    if (!room) return;

    try {
      await markMessagesAsRead(room.id);
      setUnreadCount(0);
      console.log("Messages marked as read");
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  }, [room]);

  const disconnect = useCallback(() => {
    console.log("Disconnecting WebSocket...");
    userChatService.disconnect();
    setIsConnected(false);
    hasSubscribedRef.current = false;
  }, []);

  const addSystemMessage = useCallback((content) => {
    const sysMsg = {
      content,
      type: "system",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, sysMsg]);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Subscribe to room when connected
  useEffect(() => {
    if (!room || !isConnected || hasSubscribedRef.current) {
      return;
    }

    const user = getUserInfo();
    if (!user) return;

    console.log("Subscribing to room:", room.id);

    // Subscribe to room messages
    const messageSubscription = userChatService.subscribeToRoom(
      room.id,
      (message) => {
        console.log("New message received:", message);
        const isSent = message.senderId === user.userId;

        setMessages((prev) => {
          // Check duplicate
          const exists = prev.some((m) => m.id === message.id);
          if (exists) {
            console.log("Duplicate message ignored:", message.id);
            return prev;
          }

          console.log("Adding new message to list");
          return [
            ...prev,
            {
              ...message,
              isSent,
              type: "message",
            },
          ];
        });

        // Update unread count if message from admin and page not visible
        if (!isSent && (!isPageVisibleRef.current || document.hidden)) {
          setUnreadCount((prev) => prev + 1);
        }
      }
    );

    // Subscribe to read status
    const readSubscription = userChatService.subscribeToReadStatus(
      room.id,
      (userId) => {
        console.log("Messages marked as read by user:", userId);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === user.userId ? { ...msg, isRead: true } : msg
          )
        );
      }
    );

    hasSubscribedRef.current = true;

    // Cleanup
    return () => {
      console.log("Unsubscribing from room:", room.id);
      if (messageSubscription) {
        userChatService.unsubscribe(`room-${room.id}`);
      }
      if (readSubscription) {
        userChatService.unsubscribe(`read-${room.id}`);
      }
      hasSubscribedRef.current = false;
    };
  }, [room, isConnected, getUserInfo]);

  // Track page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      isPageVisibleRef.current = !document.hidden;

      if (
        !document.hidden &&
        room &&
        window.location.pathname.includes("profile")
      ) {
        console.log("User returned to page, marking as read");
        markAsRead();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [room, markAsRead]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("Cleaning up chat context...");
      disconnect();
    };
  }, [disconnect]);

  const value = {
    room,
    messages,
    isConnected,
    isConnecting,
    isLoading,
    error,
    unreadCount,
    initializeChat,
    connectWebSocket,
    disconnect,
    sendMessage,
    markAsRead,
    addSystemMessage,
    clearError,
    getUserInfo,
    getToken,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
