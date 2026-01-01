import api from "./api";

// Lấy tất cả chat rooms (Admin only)
export const getAllChatRooms = async () => {
  try {
    const response = await api.get("/chat/rooms");
    return response.data;
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    throw error;
  }
};

// Lấy thông tin một chat room
export const getChatRoom = async (roomId) => {
  try {
    const response = await api.get(`/chat/rooms/${roomId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chat room:", error);
    throw error;
  }
};

// Lấy messages của một room
export const getChatMessages = async (roomId, page = 0, size = 50) => {
  try {
    const response = await api.get(`/chat/rooms/${roomId}/messages`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// Gửi message qua REST API (fallback)
export const sendMessage = async (messageData) => {
  try {
    const response = await api.post("/chat/send", messageData);
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// Đánh dấu messages đã đọc
export const markMessagesAsRead = async (roomId) => {
  try {
    await api.post(`/chat/rooms/${roomId}/read`);
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw error;
  }
};

// Lấy số lượng tin nhắn chưa đọc (Admin)
export const getUnreadCount = async () => {
  try {
    const response = await api.get("/chat/unread-count");
    return response.data;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    throw error;
  }
};
