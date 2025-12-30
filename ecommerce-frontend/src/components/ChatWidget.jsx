import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

const BOT_RESPONSES = {
  greeting:
    'Xin chào! 👋 Tôi là trợ lý ảo. Tôi có thể giúp bạn:\n\n1️⃣ Hướng dẫn chọn size\n2️⃣ Chính sách đổi trả\n3️⃣ Thời gian giao hàng\n4️⃣ Phương thức thanh toán\n\n💬 Cần hỗ trợ trực tiếp? Nhấn nút "Chat với Admin" bên dưới',
  size: "HƯỚNG DẪN CHỌN SIZE:\n\n📏 Size S: 45-52kg (Cao 1m50-1m60)\n📏 Size M: 53-58kg (Cao 1m60-1m68)\n📏 Size L: 59-65kg (Cao 1m68-1m75)\n📏 Size XL: 66-75kg (Cao 1m75-1m80)\n\n💡 Nếu cân nặng gần giới hạn trên, nên chọn size lớn hơn nhé!",
  return:
    "CHÍNH SÁCH ĐỔI TRẢ:\n\n✅ Đổi size miễn phí trong 7 ngày\n✅ Sản phẩm chưa qua sử dụng, còn nguyên tag\n✅ Hoàn tiền 100% nếu lỗi từ shop\n✅ Đổi trả tại nhà miễn phí (nội thành HN, HCM)\n\n📞 Liên hệ: 1900xxxx",
  shipping:
    "THỜI GIAN GIAO HÀNG:\n\n🚚 Nội thành HN/HCM: 1-2 ngày\n🚚 Tỉnh thành khác: 2-4 ngày\n🚚 Vùng xa: 4-7 ngày\n\n📦 Miễn phí ship đơn từ 300k\n⚡ Giao hàng nhanh +30k",
  payment:
    "PHƯƠNG THỨC THANH TOÁN:\n\n💳 COD (Thanh toán khi nhận hàng)\n💳 Chuyển khoản ngân hàng\n💳 Ví điện tử (Momo, ZaloPay)\n💳 Thẻ tín dụng/ghi nợ\n\n🎁 Giảm 5% khi thanh toán trước",
  admin:
    "Đang chuyển bạn sang trang chat với admin... ⏳\n\nVui lòng đợi trong giây lát!",
  default:
    'Xin lỗi, tôi chưa hiểu câu hỏi của bạn. 😅\n\nBạn có thể:\n• Gõ từ khóa: size, đổi trả, ship, thanh toán\n• Hoặc nhấn nút "Chat với Admin" để được hỗ trợ trực tiếp',
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showAdminButton, setShowAdminButton] = useState(true);

  const messagesEndRef = useRef(null);
  const hasGreeted = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !hasGreeted.current) {
      hasGreeted.current = true;
      setMessages([
        {
          content: BOT_RESPONSES.greeting,
          type: "bot",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  }, [isOpen]);

  const handleBotMessage = (input) => {
    const lowerInput = input.toLowerCase().trim();

    const userMessage = {
      content: input,
      createdAt: new Date().toISOString(),
      isSent: true,
      type: "message",
    };

    setMessages((prev) => [...prev, userMessage]);

    // Check for admin request
    if (lowerInput.includes("admin") || lowerInput.includes("nhân viên")) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            content: BOT_RESPONSES.admin,
            type: "bot",
            createdAt: new Date().toISOString(),
          },
        ]);
        setTimeout(() => {
          goToAdminChat();
        }, 1500);
      }, 500);
      return;
    }

    // Bot responses
    let response = BOT_RESPONSES.default;
    if (lowerInput.includes("size") || lowerInput.includes("số đo")) {
      response = BOT_RESPONSES.size;
    } else if (
      lowerInput.includes("đổi") ||
      lowerInput.includes("trả") ||
      lowerInput.includes("hoàn")
    ) {
      response = BOT_RESPONSES.return;
    } else if (
      lowerInput.includes("ship") ||
      lowerInput.includes("giao") ||
      lowerInput.includes("vận chuyển")
    ) {
      response = BOT_RESPONSES.shipping;
    } else if (
      lowerInput.includes("thanh toán") ||
      lowerInput.includes("payment") ||
      lowerInput.includes("chuyển khoản")
    ) {
      response = BOT_RESPONSES.payment;
    } else if (
      lowerInput.includes("xin chào") ||
      lowerInput.includes("hello") ||
      lowerInput.includes("hi")
    ) {
      response = BOT_RESPONSES.greeting;
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          content: response,
          type: "bot",
          createdAt: new Date().toISOString(),
        },
      ]);
    }, 800);
  };

  // Handle send message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    handleBotMessage(inputMessage);
    setInputMessage("");
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const goToAdminChat = () => {
    window.location.href = "/profile/admin-chat";
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <div>
                  <h3 className="font-bold text-lg">🤖 Trợ Lý Ảo</h3>
                  <p className="text-xs opacity-90">Hỗ trợ tự động 24/7</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 rounded-full p-1 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-500">Chưa có tin nhắn nào</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                // Bot message
                if (msg.type === "bot") {
                  return (
                    <div key={index} className="flex mb-3 justify-start">
                      <div className="flex gap-2 max-w-[85%]">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-2 shadow-sm">
                          <p className="text-sm whitespace-pre-line">
                            {msg.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                // User message
                return (
                  <div key={index} className="flex mb-3 justify-end">
                    <div className="max-w-[80%] bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl rounded-br-sm px-4 py-2 shadow-sm">
                      <p className="text-sm break-words whitespace-pre-line">
                        {msg.content}
                      </p>
                      <p className="text-xs text-purple-100 mt-1">
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Nhập câu hỏi..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full p-2 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Admin Chat Button */}
            {showAdminButton && (
              <button
                onClick={goToAdminChat}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2 px-4 rounded-full text-sm font-medium hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                💬 Chat với Admin
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
