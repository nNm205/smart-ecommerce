import chatbotApi from "./chatbotApi";

const ChatBotService = {
  sendMessage: async (message, userId, conversationId = null) => {
    try {
      console.log("📤 Sending message:", { message, userId, conversationId });

      const response = await chatbotApi.post(`/chat-bot`, {
        message: message.trim(),
        user_id: userId,
        conversation_id: conversationId,
      });

      console.log("📥 Response:", response.data);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("❌ Error sending message:", error);
      console.error("Error response:", error.response?.data);

      return {
        success: false,
        error: error.response?.data?.detail || "Không thể gửi tin nhắn",
      };
    }
  },

  getConversation: async (conversationId, userId) => {
    try {
      const response = await chatbotApi.get(
        `/conversations/${conversationId}`,
        {
          params: { user_id: userId },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error getting conversation:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Không thể tải lịch sử chat",
      };
    }
  },

  listConversation: async (userId, limit = 20) => {
    try {
      const response = await chatbotApi.post(`/conversations/list`, {
        user_id: userId,
        limit: limit,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error listing conversations:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Không thể tải danh sách chat",
      };
    }
  },

  searchProducts: async (params) => {
    try {
      const response = await chatbotApi.post("/search/products", {
        query: params.query,
        category: params.category || null,
        min_price: params.minPrice || null,
        max_price: params.maxPrice || null,
        limit: params.limit || 10,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error searching products:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Không thể tìm kiếm sản phẩm",
      };
    }
  },

  healthCheck: async () => {
    try {
      const response = await chatbotApi.get("/health");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: "Service không khả dụng",
      };
    }
  },
};

export default ChatBotService;
