import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, Send, MoreVertical, Check, CheckCheck, User, Package } from 'lucide-react';
import { format } from 'date-fns';
import useStore from '../store/useStore';
import { useSocket } from '../contexts/SocketContext';
import { chatAPI } from '../services/api';
import toast from 'react-hot-toast';

function ChatLayout() {
    const navigate = useNavigate();
    const { id: chatIdParam } = useParams();
    const { user } = useStore();
    const { socket, connected, joinChat, sendMessage, onReceiveMessage } = useSocket();

    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messageText, setMessageText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(() => {
        if (chatIdParam && chats.length > 0) {
            const chat = chats.find(c => c._id === chatIdParam);
            if (chat) {
                setActiveChat(chat);
                joinChat(chat._id);
            }
        }
    }, [chatIdParam, chats, joinChat]);

    useEffect(() => {
        onReceiveMessage((data) => {
            setChats(prevChats => {
                return prevChats.map(chat => {
                    if (chat._id === data.chatId) {
                        const hasMessage = chat.messages.some(m => m._id === data.message._id);
                        if (!hasMessage) {
                            return {
                                ...chat,
                                messages: [...chat.messages, data.message],
                                lastMessage: data.message.text,
                                lastMessageAt: data.message.timestamp
                            };
                        }
                    }
                    return chat;
                }).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
            });

            if (activeChat && activeChat._id === data.chatId) {
                setActiveChat(prev => ({
                    ...prev,
                    messages: [...prev.messages, data.message],
                    lastMessage: data.message.text,
                    lastMessageAt: data.message.timestamp
                }));
            }
        });
    }, [onReceiveMessage, activeChat]);

    useEffect(() => {
        scrollToBottom();
    }, [activeChat?.messages]);

    const fetchChats = async () => {
        try {
            setLoading(true);
            const res = await chatAPI.getAll();
            const loadedChats = res.data?.data?.chats || [];
            setChats(loadedChats);

            if (!chatIdParam && loadedChats.length > 0) {
                setActiveChat(loadedChats[0]);
                navigate(`/chats/${loadedChats[0]._id}`, { replace: true });
            }
        } catch (error) {
            console.error('Failed to load chats:', error);
            toast.error('Failed to load chats');
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText.trim() || !activeChat) return;

        const tempMsg = messageText;
        setMessageText('');

        try {
            const res = await chatAPI.sendMessage(activeChat._id, { text: tempMsg, type: 'text' });
            const newMessage = res.data?.data?.message;

            if (newMessage) {
                // Fallback if socket is not fast enough
                setChats(prev => prev.map(c =>
                    c._id === activeChat._id
                        ? { ...c, messages: [...c.messages, newMessage], lastMessage: tempMsg, lastMessageAt: new Date() }
                        : c
                ));
                if (activeChat._id === newMessage.chatId || true) {
                    setActiveChat(prev => ({
                        ...prev,
                        messages: [...prev.messages, newMessage]
                    }));
                }
                sendMessage(activeChat._id, newMessage);
            }
        } catch (error) {
            toast.error('Failed to send message');
            setMessageText(tempMsg);
        }
    };

    const getOtherParticipant = (chat) => {
        if (!chat || !chat.participants) return null;
        return chat.participants.find(p => p && p._id !== (user.id || user._id));
    };

    const filteredChats = chats.filter(chat => {
        const other = getOtherParticipant(chat);
        return other?.profile?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chat.product?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Derived state to handle responsive classes
    const showSidebar = !chatIdParam || window.innerWidth > 1024;
    const showChatArea = !!chatIdParam || window.innerWidth > 1024;

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">

            {/* Sidebar / Chat List */}
            <div className={`w-full lg:w-96 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col ${!showSidebar ? 'hidden lg:flex' : 'flex'}`}>

                {/* Header */}
                <div className="h-20 bg-gray-50 flex items-center justify-between px-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-200 rounded-full" onClick={() => navigate(-1)}>
                            <ArrowLeft size={20} />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-farm-green-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                            {(user?.name || 'U')[0].toUpperCase()}
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">Messages</h1>
                    </div>
                </div>

                {/* Search */}
                <div className="p-3 bg-white border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search chats or products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-100 text-gray-900 border-none rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-farm-green-500 focus:bg-white transition-colors"
                        />
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto bg-white">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading chats...</div>
                    ) : filteredChats.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No conversations found.</div>
                    ) : (
                        filteredChats.map(chat => {
                            const other = getOtherParticipant(chat);
                            const isActive = activeChat?._id === chat._id;

                            return (
                                <div
                                    key={chat._id}
                                    onClick={() => navigate(`/chats/${chat._id}`)}
                                    className={`flex items-center gap-3 p-3 sm:p-4 border-b border-gray-100 cursor-pointer transition-colors ${isActive ? 'bg-farm-green-50' : 'hover:bg-gray-50'}`}
                                >
                                    <div className="relative w-12 h-12 flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-400">
                                            {other?.profile?.avatar ? (
                                                <img src={other.profile.avatar} alt={other.profile.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={24} />
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="text-base font-bold text-gray-900 truncate">
                                                {other?.profile?.name || 'Unknown User'}
                                            </h3>
                                            <span className="text-xs font-semibold text-gray-500">
                                                {chat.lastMessageAt ? format(new Date(chat.lastMessageAt), 'HH:mm') : ''}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                            <span className="truncate flex-1">{chat.lastMessage || 'No messages yet'}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 flex flex-col bg-[#efeae2] ${!showChatArea ? 'hidden lg:flex' : 'flex'}`}>
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shadow-sm z-10 sticky top-0">
                            <div className="flex items-center gap-4">
                                <button className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full" onClick={() => navigate('/chats')}>
                                    <ArrowLeft size={24} />
                                </button>

                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-400">
                                    {getOtherParticipant(activeChat)?.profile?.avatar ? (
                                        <img src={getOtherParticipant(activeChat).profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={24} />
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <h2 className="text-lg font-bold text-gray-900 leading-tight">
                                        {getOtherParticipant(activeChat)?.profile?.name || 'Unknown User'}
                                    </h2>
                                    {activeChat.product && (
                                        <div className="flex items-center gap-1 text-xs font-semibold text-farm-green-600 mt-0.5">
                                            <Package size={12} />
                                            <span className="truncate max-w-[150px] sm:max-w-xs">{activeChat.product.title}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-2 sm:p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                                    <Search size={20} />
                                </button>
                                <button className="p-2 sm:p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                            {activeChat.messages?.map((msg, index) => {
                                const isMine = msg.sender === (user.id || user._id);
                                const isSystem = msg.type === 'system';

                                if (isSystem) {
                                    return (
                                        <div key={msg._id || index} className="flex justify-center my-4">
                                            <span className="bg-orange-100/80 text-orange-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm backdrop-blur-sm">
                                                {msg.text}
                                            </span>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={msg._id || index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm relative group ${isMine ? 'bg-farm-green-600 text-white rounded-tr-sm' : 'bg-white text-gray-900 rounded-tl-sm border border-gray-100'
                                            }`}>
                                            <div className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                                                {msg.text}
                                            </div>

                                            <div className={`flex items-center justify-end gap-1 mt-1 ${isMine ? 'text-farm-green-100' : 'text-gray-400'}`}>
                                                <span className="text-[10px] font-medium">
                                                    {format(new Date(msg.timestamp || new Date()), 'HH:mm')}
                                                </span>
                                                {isMine && (
                                                    msg.read ? <CheckCheck size={14} className="text-white" /> : <Check size={14} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input Container */}
                        <div className="bg-[#f0f2f5] px-4 sm:px-6 py-3 pb-4 sm:pb-3 border-t border-gray-200">
                            <form onSubmit={handleSendMessage} className="flex items-end gap-2 sm:gap-4 max-w-6xl mx-auto">
                                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex items-center px-4 py-1.5 focus-within:ring-2 focus-within:ring-farm-green-500 focus-within:border-transparent transition-all">
                                    <textarea
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e);
                                            }
                                        }}
                                        placeholder="Type a message..."
                                        className="w-full bg-transparent border-none focus:ring-0 py-2.5 max-h-32 min-h-[44px] resize-none text-[15px] leading-relaxed text-gray-900"
                                        rows={1}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!messageText.trim()}
                                    className="bg-farm-green-600 hover:bg-farm-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3.5 rounded-full shadow-sm transition-all flex-shrink-0 active:scale-95"
                                >
                                    <Send size={20} className="ml-0.5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-[#f0f2f5] border-l border-gray-200">
                        <div className="w-80 text-center space-y-6">
                            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-gray-100">
                                <Package size={48} className="text-farm-green-200" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-light text-gray-800 tracking-tight mb-3">FarmFresh Web</h2>
                                <p className="text-gray-500 font-medium">Select a conversation from the left menu to start messaging farmers directly.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatLayout;
