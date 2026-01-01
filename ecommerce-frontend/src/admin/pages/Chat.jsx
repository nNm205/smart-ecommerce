import React, { useState, useEffect, useRef } from "react";
import { Search, MessageSquare, Send, AlertCircle } from "lucide-react";
import useChat from "../hooks/useChat";

const Chat = () => {
  const {
    rooms,
    selectedRoom,
    messages,
    loading,
    wsConnected,
    totalUnread,
    selectRoom,
    sendMessage: sendMsg,
  } = useChat();

  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom || sending) return;

    setSending(true);
    try {
      await sendMsg(newMessage, selectedRoom.id);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Không thể gửi tin nhắn. Vui lòng thử lại!");
    } finally {
      setSending(false);
    }
  };

  // Filter rooms
  const filteredRooms = rooms.filter(
    (room) =>
      room.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Hôm qua";
    } else {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Chat với Khách hàng
          </h2>
          <p className="text-gray-600">
            {wsConnected ? (
              <span className="text-green-600">● Đã kết nối</span>
            ) : (
              <span className="text-orange-600">● Đang kết nối lại...</span>
            )}
          </p>
        </div>
        {totalUnread > 0 && (
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
            {totalUnread} tin nhắn chưa đọc
          </div>
        )}
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Room List */}
        <div className="w-80 bg-white rounded-lg shadow overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Tìm kiếm khách hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredRooms.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare
                  size={48}
                  className="mx-auto mb-3 text-gray-300"
                />
                <p>Chưa có cuộc trò chuyện nào</p>
              </div>
            ) : (
              filteredRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => selectRoom(room)}
                  className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedRoom?.id === room.id
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                        {room.userName.charAt(0).toUpperCase()}
                      </div>
                      {room.isActive && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-800 truncate">
                          {room.userName}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {room.lastMessage &&
                            formatTime(room.lastMessage.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-gray-600 truncate flex-1">
                          {room.lastMessage
                            ? room.lastMessage.content
                            : "Chưa có tin nhắn"}
                        </p>
                        {room.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 flex-shrink-0">
                            {room.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-white rounded-lg shadow flex flex-col">
          {selectedRoom ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                      {selectedRoom.userName.charAt(0).toUpperCase()}
                    </div>
                    {selectedRoom.isActive && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {selectedRoom.userName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedRoom.userEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Chưa có tin nhắn nào</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isAdmin = msg.senderRole === "ADMIN";
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${
                          isAdmin ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex gap-2 max-w-md ${
                            isAdmin ? "flex-row-reverse" : "flex-row"
                          }`}
                        >
                          {!isAdmin && (
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 shadow-md">
                              {msg.senderName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div
                              className={`px-4 py-2 rounded-2xl shadow-sm ${
                                isAdmin
                                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm"
                                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                              }`}
                            >
                              <p className="break-words">{msg.content}</p>
                            </div>
                            <div
                              className={`flex items-center gap-2 mt-1 ${
                                isAdmin ? "justify-end" : "justify-start"
                              }`}
                            >
                              <span className="text-xs text-gray-500">
                                {formatTime(msg.createdAt)}
                              </span>
                              {isAdmin && (
                                <span className="text-xs text-blue-500">
                                  {msg.isRead ? "✓✓" : "✓"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                {!wsConnected && (
                  <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2 text-sm text-orange-700">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <span>
                      Mất kết nối WebSocket. Tin nhắn vẫn được gửi qua API.
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Nhập tin nhắn..."
                    disabled={sending}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-all"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {sending ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <Send size={20} />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
              <div className="text-center">
                <MessageSquare
                  size={64}
                  className="text-gray-300 mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Chọn một cuộc trò chuyện
                </h3>
                <p className="text-gray-600">
                  Chọn khách hàng từ danh sách bên trái để bắt đầu chat
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
