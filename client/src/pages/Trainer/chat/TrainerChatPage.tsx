import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import TrainerSidebar from '../../../components/trainer/Sidebar';
import TrainerHeader from '../../../components/trainer/Header';
import ChatTrainerSidebar from '../../../components/chat/ChatTrainerSideBar';
import ChatWindow from '../../../components/chat/ChatWindow';
import { useInitiateChatTrainer } from '../../../hooks/chat/chatHooks';
import { socketService } from '../../../service/socket/socket';
import type { Rootstate } from '../../../redux/store';
import { MessageSquare, Loader2 } from 'lucide-react';

interface Chat {
    chatId: string;
    userName: string;
    userProfilePic: string;
    userId: string;
    unreadCount: number;
    lastMessage?: {
        text: string;
        timestamp: string;
        senderId?: string;
    };
}

interface InitiateChatResponse {
    success: boolean;
    message: string;
    data: {
        result: Chat[];
    };
}

interface Message {
    _id: string;
    chatId: string;
    senderId: string;
    type: 'text' | 'image' | 'file' | 'video' | 'audio';
    text?: string;
    attachment?: {
        key: string;
        fileName: string;
        fileType: string;
        fileSize: number;
        url?: string;
    };
    isDeleted: boolean;
    createdAt: string;
}

const TrainerChatPage = () => {
    const token = useSelector((state: Rootstate) => state.authData.accessToken);
    const userId = useSelector((state: Rootstate) => state.authData._id);
    
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [chatUpdates, setChatUpdates] = useState<Record<string, { 
        text: string; 
        timestamp: string;
        senderId: string;
    }>>({});
    const [localUnreadCounts, setLocalUnreadCounts] = useState<Record<string, number>>({});
    
    const { data, isLoading, isError, error } = useInitiateChatTrainer();

    const chatData = data as InitiateChatResponse | undefined;
    const baseChats: Chat[] = chatData?.data?.result || [];

    // ✅ Initialize socket connection
    useEffect(() => {
        if (token && userId) {
            console.log('🔌 TRAINER - Initializing socket connection:', userId);
            socketService.connect(token, userId);
        }

        return () => {
            console.log('🔌 TRAINER - Cleaning up socket connection');
            socketService.disconnect();
        };
    }, [token, userId]);

    // ✅ Join all chat rooms when chats are loaded
    useEffect(() => {
        if (baseChats.length > 0) {
            console.log('🔗 TRAINER - Joining all chat rooms:', baseChats.length);
            baseChats.forEach(chat => {
                console.log('🔗 Joining room:', chat.chatId);
                socketService.joinRoom(chat.chatId);
            });
        }

        // Cleanup: leave all rooms when component unmounts
        return () => {
            if (baseChats.length > 0) {
                console.log('🚪 TRAINER - Leaving all chat rooms');
                baseChats.forEach(chat => {
                    socketService.leaveRoom(chat.chatId);
                });
            }
        };
    }, [baseChats.length]); // Only re-run when number of chats changes

    // ✅ Define message handler with useCallback and detailed logging
  const handleReceiveMessage = useCallback((message: Message) => {
    const previewText = message.type === 'text'
        ? (message.text || '')
        : message.type === 'image' ? '📷 Image'
        : message.type === 'video' ? '🎥 Video'
        : message.type === 'audio' ? '🎵 Audio'
        : '📄 File';

    // ✅ key fix: use functional update with [message.chatId]
    setChatUpdates(prev => ({
        ...prev,
        [message.chatId]: {
            text: previewText,
            timestamp: message.createdAt,
            senderId: message.senderId,
        }
    }));

    const shouldIncrementUnread = selectedChatId !== message.chatId && message.senderId !== userId;

    if (shouldIncrementUnread) {
        setLocalUnreadCounts(prev => ({
            ...prev,
            [message.chatId]: (prev[message.chatId] || 0) + 1
        }));
    }
}, [selectedChatId, userId, baseChats.length]);

    // ✅ Listen for messages globally
    useEffect(() => {
        console.log('👂 TRAINER - Setting up message listener');
        socketService.onReceiveMessage(handleReceiveMessage);

        return () => {
            console.log('👂 TRAINER - Removing message listener');
            // remove only this handler instead of removing the shared socket listener
            socketService.removeListener('receive_message', handleReceiveMessage);
        };
    }, [handleReceiveMessage]);

    const handleChatSelect = (chatId: string) => {
        console.log('💬 TRAINER - Chat selected:', chatId);
        setSelectedChatId(chatId);
        
        // ✅ Reset unread count for this chat when selected
        setLocalUnreadCounts(prev => ({
            ...prev,
            [chatId]: 0
        }));
    };

    const handleMessageSent = (chatId: string, text: string, senderId?: string, timestamp?: string) => {
        console.log('📤 TRAINER - Message sent:', { chatId, text, senderId, timestamp });
        setChatUpdates(prev => ({
            ...prev,
            [chatId]: {
                text: text,
                timestamp: timestamp || new Date().toISOString(),
                senderId: senderId || userId || '',
            }
        }));
    };

    // ✅ Merge base chats with updates and sort by last message timestamp
    const sortedChats = useMemo(() => {
        const chatsWithUpdates = baseChats.map(chat => {
            const hasUpdate = chatUpdates[chat.chatId];
            const localUnread = localUnreadCounts[chat.chatId];
            
            return {
                ...chat,
                lastMessage: hasUpdate || chat.lastMessage,
                unreadCount: selectedChatId === chat.chatId 
                    ? 0 
                    : (localUnread !== undefined ? localUnread : chat.unreadCount)
            };
        });

        // Sort by last message timestamp (most recent first)
        const sorted = chatsWithUpdates.sort((a, b) => {
            const timeA = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : 0;
            const timeB = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : 0;
            return timeB - timeA;
        });

        console.log('📊 TRAINER - Sorted chats:', sorted.map(c => ({
            chatId: c.chatId,
            userName: c.userName,
            unread: c.unreadCount,
            lastMsg: c.lastMessage?.text?.substring(0, 20)
        })));

        return sorted;
    }, [baseChats, chatUpdates, localUnreadCounts, selectedChatId]);

    const selectedChat = sortedChats.find(chat => chat.chatId === selectedChatId);

    // ✅ Debug: Log connection status periodically
    useEffect(() => {
        const interval = setInterval(() => {
            console.log('🔍 TRAINER Connection Status:', {
                isConnected: socketService.isConnected(),
                totalChats: baseChats.length,
                selectedChat: selectedChatId,
                roomsJoined: baseChats.map(c => c.chatId)
            });
        }, 10000); // Every 10 seconds

        return () => clearInterval(interval);
    }, [baseChats, selectedChatId]);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <TrainerSidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <TrainerHeader />

                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-shrink-0">
                        {isLoading ? (
                            <div className="w-full md:w-80 bg-white border-r border-gray-200 flex items-center justify-center h-full">
                                <div className="text-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">Loading chats...</p>
                                </div>
                            </div>
                        ) : isError ? (
                            <div className="w-full md:w-80 bg-white border-r border-gray-200 flex items-center justify-center h-full">
                                <div className="text-center p-4">
                                    <MessageSquare className="w-12 h-12 text-red-400 mx-auto mb-3" />
                                    <p className="text-sm text-red-600 font-medium">Error loading chats</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {error instanceof Error ? error.message : 'Please try again later'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <ChatTrainerSidebar 
                                chats={sortedChats} 
                                selectedChatId={selectedChatId}
                                onChatSelect={handleChatSelect}
                            />
                        )}
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {selectedChat ? (
                            <ChatWindow 
                                chatId={selectedChat.chatId}
                                userName={selectedChat.userName}
                                userProfilePic={selectedChat.userProfilePic}
                                userId={selectedChat.userId}
                                onMessageSent={handleMessageSent}
                            />
                        ) : (
                            <div className="flex-1 flex items-center justify-center bg-white">
                                <div className="text-center p-8">
                                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                        Select a conversation
                                    </h3>
                                    <p className="text-gray-500">
                                        Choose a client from the sidebar to start messaging
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainerChatPage;