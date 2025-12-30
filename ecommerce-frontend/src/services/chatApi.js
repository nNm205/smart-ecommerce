import api from "./api"; // Your existing axios instance

const API_BASE = "/chat";

export const getMyRoom = async () => {
  try {
    const response = await api.get(`${API_BASE}/my-room`);
    console.log("✅ Got my room:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error getting my room:", error);
    throw error;
  }
};

export const getRoomMessages = async (roomId, page = 0, size = 50) => {
  try {
    const response = await api.get(`${API_BASE}/rooms/${roomId}/messages`, {
      params: { page, size },
    });
    console.log(
      `✅ Loaded ${response.data.length} messages for room ${roomId}`
    );
    return response.data;
  } catch (error) {
    console.error(`❌ Error loading messages for room ${roomId}:`, error);
    throw error;
  }
};

export const sendMessage = async (messageData) => {
  try {
    const response = await api.post(`${API_BASE}/send`, messageData);
    console.log("✅ Message sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error sending message:", error);

    // Handle specific errors
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;

      if (status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      } else if (status === 403) {
        throw new Error("Bạn không có quyền gửi tin nhắn trong phòng này.");
      } else if (status === 404) {
        throw new Error("Không tìm thấy phòng chat.");
      } else {
        throw new Error(message || "Không thể gửi tin nhắn.");
      }
    }

    throw error;
  }
};

export const markMessagesAsRead = async (roomId) => {
  try {
    await api.post(`${API_BASE}/rooms/${roomId}/read`);
    console.log(`✅ Messages marked as read for room ${roomId}`);
  } catch (error) {
    console.error(
      `❌ Error marking messages as read for room ${roomId}:`,
      error
    );
  }
};

export const getRoomDetails = async (roomId) => {
  try {
    const response = await api.get(`${API_BASE}/rooms/${roomId}`);
    console.log(`✅ Got room details for ${roomId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error getting room details for ${roomId}:`, error);
    throw error;
  }
};

export const uploadChatFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ File uploaded:", response.data.url);
    return response.data.url;
  } catch (error) {
    console.error("❌ Error uploading file:", error);
    throw new Error("Không thể tải file lên. Vui lòng thử lại.");
  }
};

export const sendImageMessage = async (roomId, imageUrl) => {
  return await sendMessage({
    roomId,
    content: imageUrl,
    messageType: "IMAGE",
  });
};

export const sendTextMessage = async (roomId, text) => {
  return await sendMessage({
    roomId,
    content: text,
    messageType: "TEXT",
  });
};

export default {
  getMyRoom,
  getRoomMessages,
  sendMessage,
  markMessagesAsRead,
  getRoomDetails,
  uploadChatFile,
  sendImageMessage,
  sendTextMessage,
};
