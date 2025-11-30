import React, { useState } from 'react';
import { Search, MessageSquare, Send, Paperclip, Smile } from 'lucide-react';

const Chat = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    const chatMessages = {
        1: [
            { id: 1, sender: 'user', text: 'Xin chào, tôi muốn hỏi về sản phẩm iPhone 15 Pro', time: '10:30' },
            { id: 2, sender: 'admin', text: 'Chào bạn! Tôi có thể giúp gì cho bạn về iPhone 15 Pro?', time: '10:31' },
            { id: 3, sender: 'user', text: 'Sản phẩm này còn hàng không ạ?', time: '10:32' },
            { id: 4, sender: 'admin', text: 'Vâng, chúng tôi vẫn còn hàng. Bạn muốn màu nào?', time: '10:33' },
        ],
        2: [
            { id: 1, sender: 'user', text: 'Tôi muốn đặt MacBook Air M2', time: '09:10' },
            { id: 2, sender: 'admin', text: 'Dạ được ạ. Bạn cần cấu hình nào?', time: '09:11' },
            { id: 3, sender: 'user', text: 'RAM 16GB, SSD 512GB', time: '09:12' },
            { id: 4, sender: 'admin', text: 'Tổng giá là 28,490,000đ. Bạn xác nhận đặt hàng nhé?', time: '09:13' },
            { id: 5, sender: 'user', text: 'Cảm ơn bạn!', time: '09:15' },
        ],
        3: [
            { id: 1, sender: 'user', text: 'Đơn hàng của tôi đến khi nào?', time: '08:40' },
            { id: 2, sender: 'admin', text: 'Cho tôi kiểm tra mã đơn hàng của bạn', time: '08:41' },
            { id: 3, sender: 'user', text: 'Mã đơn #ĐH003', time: '08:42' },
            { id: 4, sender: 'admin', text: 'Đơn hàng sẽ được giao trong 2-3 ngày tới', time: '08:43' },
            { id: 5, sender: 'user', text: 'Khi nào giao hàng?', time: '08:45' },
        ],
        4: [
            { id: 1, sender: 'user', text: 'Tôi muốn đổi sản phẩm', time: 'Hôm qua' },
            { id: 2, sender: 'admin', text: 'Bạn muốn đổi sản phẩm nào ạ?', time: 'Hôm qua' },
            { id: 3, sender: 'user', text: 'Được rồi, cảm ơn', time: 'Hôm qua' },
        ],
    };

    const [allMessages, setAllMessages] = useState(chatMessages);

    const chatList = [
        { id: 1, name: 'Nguyễn Văn A', lastMsg: 'Sản phẩm này còn hàng không ạ?', time: '10:32', unread: 2, avatar: 'NA', online: true },
        { id: 2, name: 'Trần Thị B', lastMsg: 'Cảm ơn bạn!', time: '09:15', unread: 0, avatar: 'TB', online: false },
        { id: 3, name: 'Lê Văn C', lastMsg: 'Khi nào giao hàng?', time: '08:45', unread: 1, avatar: 'LC', online: true },
        { id: 4, name: 'Phạm Thị D', lastMsg: 'Được rồi, cảm ơn', time: 'Hôm qua', unread: 0, avatar: 'PD', online: false },
    ];

    const handleSendMessage = () => {
        if (newMessage.trim() && selectedChat) {
            const newMsg = {
                id: (allMessages[selectedChat.id]?.length || 0) + 1,
                sender: 'admin',
                text: newMessage,
                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            };
            setAllMessages({
                ...allMessages,
                [selectedChat.id]: [...(allMessages[selectedChat.id] || []), newMsg]
            });
            setNewMessage('');
        }
    };

    const currentMessages = selectedChat ? (allMessages[selectedChat.id] || []) : [];

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Chat</h2>
                <p className="text-gray-600">Trò chuyện với khách hàng</p>
            </div>

            <div className="flex-1 flex gap-4 overflow-hidden">
                {/* Chat List */}
                <div className="w-80 bg-white rounded-lg shadow overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm cuộc trò chuyện..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {chatList.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${
                                    selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                            {chat.avatar}
                                        </div>
                                        {chat.online && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-semibold text-gray-800 truncate">{chat.name}</h4>
                                            <span className="text-xs text-gray-500">{chat.time}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-600 truncate">{chat.lastMsg}</p>
                                            {chat.unread > 0 && (
                                                <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                          {chat.unread}
                        </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 bg-white rounded-lg shadow flex flex-col">
                    {selectedChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                        {selectedChat.avatar}
                                    </div>
                                    {selectedChat.online && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{selectedChat.name}</h3>
                                    <p className="text-xs text-green-600">{selectedChat.online ? 'Đang hoạt động' : 'Không hoạt động'}</p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {currentMessages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex gap-2 max-w-md ${msg.sender === 'admin' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            {msg.sender === 'user' && (
                                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                                    {selectedChat.avatar}
                                                </div>
                                            )}
                                            <div>
                                                <div className={`px-4 py-2 rounded-lg ${
                                                    msg.sender === 'admin'
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {msg.text}
                                                </div>
                                                <span className="text-xs text-gray-500 mt-1 block">{msg.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Message Input */}
                            <div className="p-4 border-t border-gray-200">
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Paperclip size={20} className="text-gray-600" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Smile size={20} className="text-gray-600" />
                                    </button>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Nhập tin nhắn..."
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <MessageSquare size={64} className="text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Chọn một cuộc trò chuyện</h3>
                                <p className="text-gray-600">Chọn khách hàng từ danh sách bên trái để bắt đầu chat</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;