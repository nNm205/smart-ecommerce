import { useState, useEffect, useCallback } from "react";
import chatService from "../services/chatService";
import {
  getAllChatRooms,
  getChatMessages,
  sendMessage as sendMessageApi,
  markMessagesAsRead,
  getUnreadCount,
} from "../utils/chatApi";

export default function useChat() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);

  // Load all rooms
  const loadRooms = useCallback(async () => {
    try {
      const data = await getAllChatRooms();
      setRooms(data);

      const count = await getUnreadCount();
      setTotalUnread(count);
    } catch (error) {
      console.error("Error loading rooms:", error);
    }
  }, []);

  // Load messages for a room
  const loadMessages = useCallback(async (roomId) => {
    try {
      const data = await getChatMessages(roomId);
      setMessages(data);

      await markMessagesAsRead(roomId);

      setRooms((prev) =>
        prev.map((room) =>
          room.id === roomId ? { ...room, unreadCount: 0 } : room
        )
      );

      const count = await getUnreadCount();
      setTotalUnread(count);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (content, roomId) => {
    try {
      const messageData = {
        roomId,
        content: content.trim(),
        messageType: "TEXT",
      };

      const sentMessage = await sendMessageApi(messageData);

      setMessages((prev) => {
        const exists = prev.some((m) => m.id === sentMessage.id);
        if (exists) return prev;
        return [...prev, sentMessage];
      });

      setRooms((prev) =>
        prev.map((room) =>
          room.id === roomId
            ? {
                ...room,
                lastMessage: sentMessage,
                updatedAt: sentMessage.createdAt,
              }
            : room
        )
      );

      return sentMessage;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }, []);

  // Select room
  const selectRoom = useCallback(
    (room) => {
      setSelectedRoom(room);
      setMessages([]);
      if (room) {
        loadMessages(room.id);
      }
    },
    [loadMessages]
  );

  // Initialize WebSocket connection
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoading(false);
      return;
    }

    chatService
      .connect(token)
      .then(() => {
        setWsConnected(true);

        // Subscribe to admin notifications
        chatService.subscribeToAdminNotifications((message) => {
          loadRooms();

          if (selectedRoom && message.roomId === selectedRoom.id) {
            setMessages((prev) => [...prev, message]);
          }
        });
      })
      .catch((error) => {
        console.error("WebSocket connection failed:", error);
        setWsConnected(false);
      });

    loadRooms().finally(() => setLoading(false));

    return () => {
      chatService.disconnect();
    };
  }, []);

  // Subscribe to selected room
  useEffect(() => {
    if (selectedRoom && wsConnected) {
      chatService.subscribeToRoom(selectedRoom.id, (message) => {
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === message.id);
          if (exists) return prev;
          return [...prev, message];
        });
        markMessagesAsRead(selectedRoom.id);
      });

      chatService.subscribeToReadStatus(selectedRoom.id, (userId) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === userId ? { ...msg, isRead: true } : msg
          )
        );
      });

      return () => {
        chatService.unsubscribe(`room-${selectedRoom.id}`);
        chatService.unsubscribe(`read-${selectedRoom.id}`);
      };
    }
  }, [selectedRoom, wsConnected]);

  return {
    rooms,
    selectedRoom,
    messages,
    loading,
    wsConnected,
    totalUnread,
    selectRoom,
    sendMessage,
    loadRooms,
    loadMessages,
  };
}
