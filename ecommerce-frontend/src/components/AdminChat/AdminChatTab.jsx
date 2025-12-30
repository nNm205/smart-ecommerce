import { useEffect, useRef, useState } from "react";
import useChat from "@/contexts/useChat";
import {
  Send,
  Loader2,
  User,
  AlertCircle,
  RefreshCw,
  CheckCheck,
} from "lucide-react";

export default function AdminChatTab() {
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);
  const initStartedRef = useRef(false); // Prevent double init

  const {
    messages,
    isConnected,
    isConnecting,
    isLoading,
    error,
    unreadCount,
    initializeChat,
    connectWebSocket,
    sendMessage,
    markAsRead,
    addSystemMessage,
    clearError,
    getUserInfo,
  } = useChat();

  const scrollToBottom = (smooth = false) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

      if (!isAtBottom) {
        setIsUserScrolling(true);
      } else {
        setIsUserScrolling(false);
        if (unreadCount > 0) {
          markAsRead();
        }
      }
    }
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [unreadCount]);

  // Auto scroll when new messages
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage?.isSent || !isUserScrolling) {
        setTimeout(() => scrollToBottom(true), 100);
      }
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages, isUserScrolling]);

  // Initialize chat ONCE
  useEffect(() => {
    if (initStartedRef.current) {
      return;
    }

    initStartedRef.current = true;

    const initChat = async () => {
      const user = getUserInfo();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      console.log("Initializing user chat...");

      const roomData = await initializeChat();

      if (!roomData) {
        console.error("Error initializing chat room");
        return;
      }

      console.log("Connecting to admin...");
      const connected = await connectWebSocket();

      if (!connected) {
        console.error("Error connecting to admin");
      } else {
        console.log("Connected successfully! Let chat with admin");
        setTimeout(() => markAsRead(), 500);
      }
    };

    initChat();
  }, []); // Empty deps - run once

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error(error);
      clearError();
    }
  }, [error, addSystemMessage, clearError]);

  // Focus input when connected
  useEffect(() => {
    if (isConnected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isConnected]);

  // Mark as read when viewing messages
  useEffect(() => {
    if (messages.length > 0 && isConnected && !isUserScrolling) {
      const hasUnread = messages.some((msg) => !msg.isSent && !msg.isRead);
      if (hasUnread) {
        markAsRead();
      }
    }
  }, [messages, isConnected, isUserScrolling, markAsRead]);

  // Show notification for new messages from admin
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      if (!lastMessage.isSent && lastMessage.type !== "system") {
        console.log("Nhận tin nhắn mới từ admin:", lastMessage.content);

        if (
          document.hidden &&
          "Notification" in window &&
          Notification.permission === "granted"
        ) {
          new Notification("Tin nhắn mới từ Admin", {
            body: lastMessage.content.substring(0, 100),
            icon: "/admin-icon.png",
          });
        }
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !isConnected || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(inputMessage.trim());
      setInputMessage("");

      setIsUserScrolling(false);
      setTimeout(() => scrollToBottom(true), 100);

      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error("Send error:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReconnect = async () => {
    console.log("Reconnecting...");
    const connected = await connectWebSocket();
    if (connected) {
      console.log("Reconnected successfully");
    } else {
      console.error("Reconnected failed. Let try again!");
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hôm nay";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hôm qua";
    } else {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach((msg) => {
      const date = formatDate(msg.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Admin Support</h2>
              <div className="flex items-center gap-2">
                {isConnecting ? (
                  <div className="flex items-center gap-1 text-xs text-yellow-600">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    Đang kết nối...
                  </div>
                ) : isConnected ? (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Đang online
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Chưa kết nối
                  </div>
                )}
              </div>
            </div>
          </div>

          {!isConnected && !isConnecting && (
            <button
              onClick={handleReconnect}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Kết nối lại
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      )}

      {/* Messages Container */}
      {!isLoading && (
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-6 py-4 bg-white"
        >
          {Object.keys(messageGroups).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Chào mừng đến với Admin Chat
              </h3>
              <p className="text-gray-600 max-w-md">
                Bạn có thể chat trực tiếp với admin tại đây. Gửi tin nhắn để bắt
                đầu cuộc trò chuyện!
              </p>
            </div>
          ) : (
            Object.entries(messageGroups).map(([date, msgs]) => (
              <div key={date} className="mb-6">
                <div className="flex items-center justify-center my-4">
                  <div className="bg-gray-100 text-gray-600 text-xs px-4 py-1.5 rounded-full font-medium">
                    {date}
                  </div>
                </div>

                {msgs.map((msg, index) => {
                  if (msg.type === "system") {
                    return (
                      <div
                        key={msg.id || index}
                        className="flex justify-center my-3"
                      >
                        <div className="bg-blue-50 text-blue-700 text-xs px-4 py-2 rounded-full border border-blue-200 flex items-center gap-2">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {msg.content}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id || index}
                      className={`flex mb-4 ${
                        msg.isSent ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          msg.isSent
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl rounded-br-md"
                            : "bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md"
                        } px-4 py-3 shadow-sm`}
                      >
                        {msg.messageType === "IMAGE" ? (
                          <img
                            src={msg.content}
                            alt="Ảnh"
                            className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => window.open(msg.content, "_blank")}
                          />
                        ) : (
                          <p className="text-sm break-words whitespace-pre-line">
                            {msg.content}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <p
                            className={`text-xs ${
                              msg.isSent ? "text-purple-100" : "text-gray-500"
                            }`}
                          >
                            {formatTime(msg.createdAt)}
                          </p>
                          {msg.isSent && (
                            <div className="flex items-center">
                              {msg.isRead ? (
                                <CheckCheck className="w-3.5 h-3.5 text-purple-200" />
                              ) : (
                                <CheckCheck className="w-3.5 h-3.5 text-purple-300 opacity-50" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
        {!isConnected && !isLoading && (
          <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 text-sm text-yellow-800">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              Chưa kết nối với server. Vui lòng nhấn "Kết nối lại" để tiếp tục.
            </span>
          </div>
        )}

        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={
              isConnected
                ? "Nhập tin nhắn..."
                : "Vui lòng kết nối để gửi tin nhắn..."
            }
            disabled={!isConnected || isLoading || isSending}
            className="flex-1 border border-gray-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
          />
          <button
            onClick={handleSendMessage}
            disabled={
              !inputMessage.trim() || !isConnected || isLoading || isSending
            }
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full px-6 py-3 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            aria-label="Send message"
          >
            {isSending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="hidden sm:inline">Đang gửi...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Gửi</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
