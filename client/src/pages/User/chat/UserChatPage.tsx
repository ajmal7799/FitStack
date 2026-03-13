import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import UserSidebar from '../../../components/user/Sidebar';
import Header from '../../../components/user/Header';
import ChatUserSidebar from '../../../components/chat/ChatSideBar';
import ChatWindow from '../../../components/chat/ChatWindow';
import { useInitiateChat } from '../../../hooks/chat/chatHooks';
import { useChatSocket } from '../../../hooks/Socket/useChat';
import { socketService } from '../../../service/socket/socket';
import type { Rootstate } from '../../../redux/store';
import { MessageSquare, Loader2, ArrowLeft } from 'lucide-react';

// Types
interface TrainerChat {
  chatId: string;
  trainerName: string;
  trainerProfilePic?: string;
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
    result: TrainerChat;
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

const UserChatPage = () => {
  const token = useSelector((state: Rootstate) => state.authData.accessToken);
  const userId = useSelector((state: Rootstate) => state.authData._id);

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatUpdates, setChatUpdates] = useState<{
    text: string;
    timestamp: string;
    senderId: string;
  } | null>(null);
  const [localUnreadCount, setLocalUnreadCount] = useState<number>(0);
  // Mobile: track which panel is visible ('sidebar' | 'chat')
  const [mobileView, setMobileView] = useState<'sidebar' | 'chat'>('sidebar');

  const { data, isLoading, isError, error } = useInitiateChat();

  const chatData = data as InitiateChatResponse | undefined;
  const baseChat: TrainerChat | null = chatData?.data?.result || null;

  useEffect(() => {
    if (token && userId) {
      socketService.connect(token, userId);
    }
    return () => {
      socketService.disconnect();
    };
  }, [token, userId]);

  useEffect(() => {
    if (baseChat?.chatId) {
      socketService.joinRoom(baseChat.chatId);
    }
  }, [baseChat?.chatId]);

  const handleReceiveMessage = useCallback(
    (message: Message) => {
      const previewText =
        message.type === 'text'
          ? message.text || ''
          : message.type === 'image'
            ? '📷 Image'
            : message.type === 'video'
              ? '🎥 Video'
              : message.type === 'audio'
                ? '🎵 Audio'
                : '📄 File';

      setChatUpdates({
        text: previewText,
        timestamp: message.createdAt,
        senderId: message.senderId,
      });

      if (selectedChatId !== message.chatId && message.senderId !== userId) {
        setLocalUnreadCount((prev) => prev + 1);
      }
    },
    [selectedChatId, userId],
  );

  useChatSocket(handleReceiveMessage);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    setLocalUnreadCount(0);
    // On mobile, switch to chat view
    setMobileView('chat');
  };

  const handleBackToSidebar = () => {
    setMobileView('sidebar');
  };

  const handleMessageSent = (
    chatId: string,
    text: string,
    senderId?: string,
    timestamp?: string,
  ) => {
    setChatUpdates({
      text,
      timestamp: timestamp || new Date().toISOString(),
      senderId: senderId || userId || '',
    });
  };

  const currentChat = useMemo(() => {
    if (!baseChat) return null;
    return {
      ...baseChat,
      lastMessage: chatUpdates || baseChat.lastMessage,
      unreadCount:
        selectedChatId === baseChat.chatId
          ? 0
          : baseChat.unreadCount + localUnreadCount,
    };
  }, [baseChat, chatUpdates, localUnreadCount, selectedChatId]);

  const isChatSelected = currentChat && selectedChatId === currentChat.chatId;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <UserSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <div className="flex-1 flex overflow-hidden">

          {/* ── SIDEBAR PANEL ── */}
          {/* Desktop: always visible. Mobile: visible only when mobileView === 'sidebar' */}
          <div
            className={`
              flex-shrink-0
              ${mobileView === 'sidebar' ? 'flex' : 'hidden'}
              md:flex
              w-full md:w-80
            `}
          >
            {isLoading ? (
              <div className="w-full bg-white border-r border-gray-200 flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Connecting to your trainer...</p>
                </div>
              </div>
            ) : isError ? (
              <div className="w-full bg-white border-r border-gray-200 flex items-center justify-center h-full">
                <div className="text-center p-4">
                  <MessageSquare className="w-12 h-12 text-red-400 mx-auto mb-3" />
                  <p className="text-sm text-red-600 font-medium">Failed to load chat</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {error instanceof Error ? error.message : 'Please try again later'}
                  </p>
                </div>
              </div>
            ) : (
              <ChatUserSidebar
                chat={currentChat}
                selectedChatId={selectedChatId}
                onChatSelect={handleChatSelect}
              />
            )}
          </div>

          {/* ── CHAT WINDOW PANEL ── */}
          {/* Desktop: always visible. Mobile: visible only when mobileView === 'chat' */}
          <div
            className={`
              flex-1 flex flex-col overflow-hidden
              ${mobileView === 'chat' ? 'flex' : 'hidden'}
              md:flex
            `}
          >
            {isChatSelected ? (
              <ChatWindow
                chatId={currentChat.chatId}
                userName={currentChat.trainerName}
                userProfilePic={currentChat.trainerProfilePic || ''}
                userId={currentChat.userId}
                onMessageSent={handleMessageSent}
                onBack={handleBackToSidebar}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-white">
                <div className="text-center p-8">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {isLoading
                      ? 'Connecting...'
                      : currentChat
                        ? 'Select a chat to start'
                        : 'No trainer assigned yet'}
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    {isLoading
                      ? 'Please wait while we connect you with your trainer'
                      : currentChat
                        ? 'Click on your trainer in the sidebar to open the conversation'
                        : 'Once you are assigned a trainer, you can start chatting here.'}
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

export default UserChatPage;