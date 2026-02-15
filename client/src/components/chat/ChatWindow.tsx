// components/chat/ChatWindow.tsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Paperclip, MoreVertical, Loader2, Trash2, X } from 'lucide-react';
import { useGetMessages, useMarkAsRead } from '../../hooks/chat/chatHooks';
import { useChatSocket } from '../../hooks/Socket/useChat';
import { socketService } from '../../service/socket/socket';
import { useSelector } from 'react-redux';
import type { Rootstate } from '../../redux/store';

interface ChatWindowProps {
    chatId: string;
    userName: string;
    userProfilePic: string;
    userId: string;
    onMessageSent?: (chatId: string, text: string, senderId?: string, timestamp?: string) => void;
}

interface Message {
    _id: string;
    chatId: string;
    senderId: string;
    text: string;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: string;
}

interface GetMessagesResponse {
    success: boolean;
    message: string;
    data: {
        messages: Message[];
    };
}


export default function ChatWindow({
    chatId,
    userName,
    userProfilePic,
    onMessageSent
}: ChatWindowProps) {
    const currentUserId = useSelector((state: Rootstate) => state.authData._id);
    const [messageInput, setMessageInput] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; messageId: string | null }>({
        isOpen: false,
        messageId: null
    });


    const { data, isLoading, isError, error, refetch } = useGetMessages(chatId);
    const markAsReadMutation = useMarkAsRead();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const messagesData = data as GetMessagesResponse | undefined;
    const apiMessages: Message[] = messagesData?.data?.messages || [];

    // ✅ Use only API messages since they're being refetched from DB
    // This ensures messages persist after refresh
    const allMessages = apiMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    useEffect(() => {
        scrollToBottom();
    }, [allMessages]);


    // --- DELETE LOGIC ---
    const openDeleteModal = (messageId: string) => {
        setDeleteModal({ isOpen: true, messageId });
    };
    
    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, messageId: null });
    };

    const confirmDelete = () => {
        if (deleteModal.messageId && socketService.isConnected()) {
            socketService.deleteMessage(deleteModal.messageId, chatId);
            closeDeleteModal();
            // Real-time update will be handled by the message_deleted socket listener
        }
    };


    // Mark chat as read when opening
    useEffect(() => {
        if (chatId) {
            markAsReadMutation.mutate(chatId);
        }
    }, [chatId]);

    // ✅ Define message handler with useCallback
    const handleChatWindowMessage = useCallback((message: Message) => {
        console.log('📥 ChatWindow received message:', message);

        // Only add message if it belongs to this chat
        if (message.chatId === chatId) {
            // ✅ Notify parent component to update sidebar with latest message
            onMessageSent?.(chatId, message.text, message.senderId, message.createdAt);

            // Add a small delay to ensure backend has saved the message
            setTimeout(() => {
                console.log('⏳ Refetching messages after delay...');
                refetch();
            }, 500);

            // Mark as read immediately since chat is open
            markAsReadMutation.mutate(chatId);
        }
    }, [chatId, markAsReadMutation, refetch, onMessageSent]);

    // ✅ NEW: Handle message deletion in real-time
    const handleMessageDeleted = useCallback((messageId: string) => {
        console.log('🗑️ ChatWindow received delete event for message:', messageId);
        // Refetch messages to show updated state
        refetch();
    }, [refetch]);

    // Listen for messages
    useChatSocket(handleChatWindowMessage);

    // ✅ Listen for message deletions
    useEffect(() => {
        socketService.onMessageDeleted(handleMessageDeleted);

        return () => {
            socketService.removeListener('message_deleted', handleMessageDeleted);
        };
    }, [handleMessageDeleted]);

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;

        const messageText = messageInput.trim();

        // Send message via socket
        socketService.sendMessage(chatId, messageText);
        onMessageSent?.(chatId, messageText);
        setMessageInput('');

        // Refetch after a delay to ensure backend has saved the message
        setTimeout(() => {
            console.log('⏳ Refetching messages after sending...');
            refetch();
        }, 500);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const isMyMessage = (senderId: string) => {
        return senderId === currentUserId;
    };

    // Helper function to get delete message text
    const getDeletedMessageText = (msg: Message) => {
        const isSent = isMyMessage(msg.senderId);
        return isSent ? 'You deleted this message' : 'This message was deleted';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        today.setHours(0, 0, 0, 0);
        yesterday.setHours(0, 0, 0, 0);
        const messageDate = new Date(date);
        messageDate.setHours(0, 0, 0, 0);

        if (messageDate.getTime() === today.getTime()) {
            return 'Today';
        } else if (messageDate.getTime() === yesterday.getTime()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
            });
        }
    };


    const shouldShowDateSeparator = (currentMsg: Message, previousMsg?: Message) => {
        if (!previousMsg) return true;
        const currentDate = new Date(currentMsg.createdAt).toDateString();
        const previousDate = new Date(previousMsg.createdAt).toDateString();
        return currentDate !== previousDate;
    };

    const renderMessagesWithDates = () => {
        return allMessages.map((msg, index) => {
            const previousMsg = index > 0 ? allMessages[index - 1] : undefined;
            const currentDate = new Date(msg.createdAt).toDateString();
            const previousDate = previousMsg ? new Date(previousMsg.createdAt).toDateString() : null;
            const showDateSeparator = currentDate !== previousDate;
            
            const isSent = isMyMessage(msg.senderId);

            return (
                <div key={msg._id}>
                    {showDateSeparator && (
                        <div className="flex items-center justify-center my-4">
                            <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                                {formatDate(msg.createdAt)}
                            </div>
                        </div>
                    )}

                    {/* Container with "group" class to trigger button visibility on hover */}
                    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2 group px-2`}>
                        <div className={`flex items-center gap-2 max-w-[80%] ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
                            
                            {/* Message Bubble */}
                            <div
                                className={`px-4 py-2 rounded-2xl relative shadow-sm ${
                                    msg.isDeleted
                                        ? 'bg-gray-100 border border-gray-200'
                                        : isSent
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                                }`}
                            >
                                {msg.isDeleted ? (
                                    // Deleted message display
                                    <p className="text-sm italic text-gray-500 flex items-center gap-2">
                                        <Trash2 className="w-3 h-3" />
                                        {getDeletedMessageText(msg)}
                                    </p>
                                ) : (
                                    // Normal message display
                                    <>
                                        <p className="text-sm break-words">{msg.text}</p>
                                        <span className={`text-[10px] mt-1 block text-right ${isSent ? 'text-blue-100' : 'text-gray-400'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* WhatsApp Style Delete Button: Visible only on hover of the message row and only for non-deleted messages */}
                            {isSent && !msg.isDeleted && (
                                <button
                                    onClick={() => openDeleteModal(msg._id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full transition-all duration-200"
                                    title="Delete message"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="flex-1 flex flex-col bg-[#f0f2f5] h-full relative">
            {deleteModal.isOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Delete Message?</h3>
                            <button onClick={closeDeleteModal} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-gray-500 text-sm mb-6">
                            Are you sure you want to delete this message? This will delete it for both you and {userName}.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button 
                                onClick={closeDeleteModal}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Chat Header */}
            <div className="p-4 border-b bg-white flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    {userProfilePic ? (
                        <img
                            src={userProfilePic}
                            alt={userName}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-gray-900">{userName}</h3>
                        <p className="text-xs text-gray-500">
                            {socketService.isConnected() ? (
                                <span className="text-green-500">● Online</span>
                            ) : (
                                <span className="text-gray-400">● Offline</span>
                            )}
                        </p>
                    </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Loading messages...</p>
                        </div>
                    </div>
                ) : isError ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-red-500">
                            <p className="text-sm font-medium">Error loading messages</p>
                            <p className="text-xs mt-1 text-gray-500">
                                {error instanceof Error ? error.message : 'Please try again later'}
                            </p>
                        </div>
                    </div>
                ) : allMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-400">
                            <p className="text-sm">No messages yet</p>
                            <p className="text-xs mt-1">Send a message to start the conversation</p>
                        </div>
                    </div>
                ) : (
                    renderMessagesWithDates()
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Paperclip className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isLoading || !socketService.isConnected()}
                        />
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() || isLoading || !socketService.isConnected()}
                        className={`p-3 rounded-full transition-all ${messageInput.trim() && !isLoading && socketService.isConnected()
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}