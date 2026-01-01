import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import ChatBotService from "@/services/chatBotService";

// ============================================================================
// PREDEFINED RESPONSES - Câu trả lời có sẵn cho các câu hỏi thường gặp
// ============================================================================
const BOT_RESPONSES = {
  greeting:
    "Xin chào! Tôi là trợ lý ảo được hỗ trợ bởi AI. Tôi có thể giúp bạn:\n\n🛍️ Tìm kiếm sản phẩm\n📏 Tư vấn chọn size\n🔄 Chính sách đổi trả\n🚚 Thông tin vận chuyển\n💳 Hướng dẫn thanh toán\n\n💬 Hãy hỏi tôi bất cứ điều gì!",

  size: "📏 HƯỚNG DẪN CHỌN SIZE:\n\n• Size S: 45-52kg (Cao 1m50-1m60)\n• Size M: 53-58kg (Cao 1m60-1m68)\n• Size L: 59-65kg (Cao 1m68-1m75)\n• Size XL: 66-75kg (Cao 1m75-1m80)\n\n💡 Tip: Nếu bạn nằm giữa 2 size, hãy chọn size lớn hơn để thoải mái nhé!",

  return:
    "✅ CHÍNH SÁCH ĐỔI TRẢ:\n\n• Đổi size miễn phí trong 7 ngày\n• Sản phẩm chưa qua sử dụng, còn nguyên tag\n• Hoàn tiền 100% nếu lỗi từ shop\n• Đổi trả tại nhà miễn phí (nội thành HN, HCM)\n\n📞 Hotline hỗ trợ: 19001111",

  shipping:
    "🚚 THỜI GIAN GIAO HÀNG:\n\n• Nội thành HN/HCM: 1-2 ngày\n• Tỉnh thành khác: 2-4 ngày\n• Vùng xa: 4-7 ngày\n\n📦 Miễn phí ship đơn từ 300k\n⚡ Giao hàng nhanh +30k",

  payment:
    "💳 PHƯƠNG THỨC THANH TOÁN:\n\n• COD (Thanh toán khi nhận hàng)\n• Ví VNPay\n• Chuyển khoản ngân hàng\n\n🔒 Thanh toán an toàn, bảo mật 100%",

  admin:
    "⏳ Đang chuyển bạn sang trang chat với admin...\n\nVui lòng đợi trong giây lát!",

  offline:
    "Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau hoặc liên hệ admin.",
};

// ============================================================================
// KEYWORD MATCHING - Từ khóa để nhận diện câu hỏi thường gặp
// ============================================================================
const KEYWORD_PATTERNS = {
  greeting: ["xin chào", "hello", "hi", "chào bạn", "chào", "hey"],

  size: [
    "size",
    "số đo",
    "kích thước",
    "kích cỡ",
    "chọn size",
    "size nào",
    "đo size",
    "bảng size",
  ],

  return: [
    "đổi trả",
    "đổi hàng",
    "trả hàng",
    "hoàn trả",
    "hoàn tiền",
    "bảo hành",
    "chính sách đổi",
    "chính sách trả",
  ],

  shipping: [
    "ship",
    "giao hàng",
    "vận chuyển",
    "ship hàng",
    "phí ship",
    "miễn phí ship",
    "giao nhanh",
    "thời gian giao",
    "bao lâu nhận được",
  ],

  payment: [
    "thanh toán",
    "payment",
    "chuyển khoản",
    "trả tiền",
    "phương thức thanh toán",
    "thanh toán thế nào",
    "cod",
    "vnpay",
  ],

  admin: [
    "admin",
    "nhân viên",
    "tư vấn viên",
    "hỗ trợ",
    "support",
    "liên hệ admin",
  ],
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  const messagesEndRef = useRef(null);
  const hasGreeted = useRef(false);

  // ========================================================================
  // UTILITY FUNCTIONS
  // ========================================================================

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCurrentUserId = () => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        return userData.userId;
      }
    } catch (e) {
      console.error("Error getting user:", e);
    }
    return null;
  };

  // ========================================================================
  // SMART MATCHING - Nhận diện câu hỏi thường gặp
  // ========================================================================

  /**
   * Kiểm tra xem message có match với keyword pattern nào không
   * @param {string} message - Tin nhắn người dùng
   * @returns {string|null} - Tên pattern match hoặc null
   */
  const matchKeywordPattern = (message) => {
    const lowerMessage = message.toLowerCase().trim();

    // Tìm pattern phù hợp nhất
    for (const [pattern, keywords] of Object.entries(KEYWORD_PATTERNS)) {
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword)) {
          return pattern;
        }
      }
    }

    return null;
  };

  /**
   * Quyết định sử dụng response có sẵn hay gọi AI
   * @param {string} message - Tin nhắn người dùng
   * @returns {object} - { useAI: boolean, responseType: string }
   */
  const shouldUseAI = (message) => {
    const matchedPattern = matchKeywordPattern(message);

    if (matchedPattern) {
      return {
        useAI: false,
        responseType: matchedPattern,
      };
    }

    // Không match pattern nào → Dùng AI
    return {
      useAI: true,
      responseType: null,
    };
  };

  // ========================================================================
  // MESSAGE HANDLERS
  // ========================================================================

  /**
   * Xử lý câu hỏi thường gặp với response có sẵn
   */
  const handlePredefinedResponse = async (responseType, originalMessage) => {
    // Xử lý đặc biệt cho admin
    if (responseType === "admin") {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            content: BOT_RESPONSES.admin,
            type: "bot",
            createdAt: new Date().toISOString(),
            isPredefined: true,
          },
        ]);
        setTimeout(() => {
          window.location.href = "/profile/admin-chat";
        }, 1500);
      }, 500);
      return;
    }

    // Response cho các câu hỏi khác
    const response = BOT_RESPONSES[responseType];

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          content: response,
          type: "bot",
          createdAt: new Date().toISOString(),
          isPredefined: true, // Đánh dấu là response có sẵn
        },
      ]);
    }, 800); // Delay nhẹ để tự nhiên hơn
  };

  /**
   * Xử lý câu hỏi phức tạp với AI
   */
  const handleAIResponse = async (message) => {
    try {
      const userId = getCurrentUserId();

      const result = await ChatBotService.sendMessage(
        message,
        userId,
        conversationId
      );

      if (result.success) {
        const { conversation_id, message: botMessage } = result.data;

        // Update conversation ID
        if (conversation_id) {
          setConversationId(conversation_id);
        }

        // Add AI response
        setMessages((prev) => [
          ...prev,
          {
            content: botMessage.content,
            type: "bot",
            createdAt: botMessage.created_at,
            messageId: botMessage.id,
            isAI: true, // Đánh dấu là response từ AI
          },
        ]);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error("AI response error:", err);
      setError("Không thể kết nối với AI. Vui lòng thử lại.");

      setMessages((prev) => [
        ...prev,
        {
          content: BOT_RESPONSES.offline,
          type: "bot",
          createdAt: new Date().toISOString(),
          isError: true,
        },
      ]);
    }
  };

  /**
   * Xử lý gửi tin nhắn - Điều phối giữa predefined và AI
   */
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const messageToSend = inputMessage.trim();

    // Add user message
    const userMessage = {
      content: messageToSend,
      type: "user",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setError(null);

    try {
      // Quyết định sử dụng response có sẵn hay AI
      const decision = shouldUseAI(messageToSend);

      console.log("💡 Decision:", decision); // Debug log

      if (decision.useAI) {
        // Dùng AI cho câu hỏi phức tạp
        console.log("🤖 Using AI for response");
        await handleAIResponse(messageToSend);
      } else {
        // Dùng response có sẵn cho câu hỏi thường gặp
        console.log("📋 Using predefined response:", decision.responseType);
        await handlePredefinedResponse(decision.responseType, messageToSend);
      }
    } catch (err) {
      console.error("Send message error:", err);
      setError("Không thể gửi tin nhắn. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================================================
  // LIFECYCLE HOOKS
  // ========================================================================

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkServiceHealth();
  }, []);

  useEffect(() => {
    if (isOpen && !hasGreeted.current) {
      hasGreeted.current = true;
      setMessages([
        {
          content: BOT_RESPONSES.greeting,
          type: "bot",
          createdAt: new Date().toISOString(),
          isPredefined: true,
        },
      ]);
    }
  }, [isOpen]);

  const checkServiceHealth = async () => {
    const result = await ChatBotService.healthCheck();
    setIsOnline(result.success);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 group"
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bot className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="font-bold text-base">AI Shopping Assistant</h3>
                  <div className="flex items-center gap-1 text-xs opacity-90">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isOnline ? "bg-green-300" : "bg-red-300"
                      } animate-pulse`}
                    />
                    <span>{isOnline ? "Online" : "Offline"}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 rounded-full p-1.5 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border-b border-red-200 px-4 py-2 flex items-center gap-2 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Bot className="w-16 h-16 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">
                    Bắt đầu cuộc trò chuyện...
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => {
                // Bot message
                if (msg.type === "bot") {
                  return (
                    <div key={index} className="flex mb-4 justify-start">
                      <div className="flex gap-2 max-w-[85%]">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.isAI
                              ? "bg-gradient-to-br from-purple-500 to-pink-500"
                              : "bg-gradient-to-br from-blue-500 to-indigo-500"
                          }`}
                        >
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div
                          className={`bg-white text-gray-800 border rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm ${
                            msg.isError ? "border-red-300" : "border-gray-200"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line leading-relaxed">
                            {msg.content}
                          </p>
                          <div className="flex items-center justify-between mt-1.5">
                            <p
                              className={`text-xs ${
                                msg.isError ? "text-red-500" : "text-gray-500"
                              }`}
                            >
                              {formatTime(msg.createdAt)}
                            </p>
                            {msg.isAI && (
                              <span className="text-xs text-purple-600 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                AI
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // User message
                return (
                  <div key={index} className="flex mb-4 justify-end">
                    <div className="max-w-[80%] bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5 shadow-sm">
                      <p className="text-sm break-words whitespace-pre-line leading-relaxed">
                        {msg.content}
                      </p>
                      <p className="text-xs text-purple-100 mt-1.5">
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex mb-4 justify-start">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                      <span className="text-xs text-gray-500">
                        Đang suy nghĩ...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            {/* Quick Actions */}
            <div className="flex gap-2 mb-3 flex-wrap">
              <button
                onClick={() => setInputMessage("size")}
                className="text-xs px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full transition-colors"
              >
                📏 Size
              </button>
              <button
                onClick={() => setInputMessage("đổi trả")}
                className="text-xs px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full transition-colors"
              >
                ✅ Đổi trả
              </button>
              <button
                onClick={() => setInputMessage("ship")}
                className="text-xs px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full transition-colors"
              >
                🚚 Ship
              </button>
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Hỏi về sản phẩm, giá cả, size..."
                disabled={isLoading || !isOnline}
                className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading || !isOnline}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full p-2.5 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Footer info */}
            <p className="text-xs text-gray-500 mt-2 text-center flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" />
              Powered by AI
            </p>
          </div>
        </div>
      )}
    </>
  );
}
