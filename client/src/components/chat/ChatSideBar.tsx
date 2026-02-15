// src/components/chat/ChatUserSidebar.tsx
import { MessageSquare, MessageCircle } from 'lucide-react';

interface TrainerChat {
  chatId: string;
  trainerName: string;
  trainerProfilePic?: string;
  userId: string;
  unreadCount: number;
  lastMessage?: {
    text: string;
    timestamp: string;
  };
}

interface UserChatSidebarProps {
  chat: TrainerChat | null;
  selectedChatId: string | null;
  onChatSelect?: (chatId: string) => void;
}

export default function ChatUserSidebar({
  chat,
  selectedChatId,
  onChatSelect
}: UserChatSidebarProps) {

  const handleChatClick = () => {
    if (chat?.chatId) {
      onChatSelect?.(chat.chatId);
    }
  };

  const isActive = chat && selectedChatId === chat.chatId;

  return (
    <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 md:p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600">
        <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
          Chat with Trainer
        </h2>
      </div>

      {/* Chat Content - only 1 trainer */}
      <div className="flex-1 overflow-y-auto">
        {!chat ? (
          <div className="p-8 text-center text-gray-500 h-full flex flex-col items-center justify-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-40" />
            <p className="text-base font-medium">No trainer assigned yet</p>
            <p className="text-sm mt-2 text-gray-400">
              Contact admin when you get your trainer
            </p>
          </div>
        ) : (
          <div
            onClick={handleChatClick}
            className={`
                p-4 border-b border-gray-100 cursor-pointer transition-all duration-200
                hover:bg-gray-50 active:bg-gray-100
                ${isActive ? 'bg-purple-50 border-l-4 border-l-purple-600' : ''}
              `}
          >
            <div className="flex items-start gap-4">
              {/* Trainer Avatar */}
              {chat.trainerProfilePic ? (
                <img
                  src={chat.trainerProfilePic}
                  alt={chat.trainerName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const next = e.currentTarget.nextElementSibling;
                    if (next instanceof HTMLElement) next.classList.remove('hidden');
                  }}
                />
              ) : null}

              <div
                className={`w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 
                    flex items-center justify-center text-white font-semibold text-xl flex-shrink-0
                    ${chat.trainerProfilePic ? 'hidden' : ''}`}
              >
                {chat.trainerName.charAt(0).toUpperCase()}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-semibold text-base truncate ${chat.unreadCount > 0 ? 'text-gray-900' : 'text-gray-900'
                    }`}>
                    {chat.trainerName}
                  </h3>

                  <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                    {chat.lastMessage && (
                      <span className={`text-xs ${chat.unreadCount > 0 ? 'text-[#25D366] font-medium' : 'text-gray-400'
                        }`}>
                        {new Date(chat.lastMessage.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  {chat.lastMessage ? (
                    <p className={`text-sm truncate flex-1 ${chat.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                      }`}>
                      {chat.lastMessage.text}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 italic flex-1">
                      Say hi to start the conversation! ✌️
                    </p>
                  )}

                  {/* WhatsApp-style unread count badge */}
                  {chat.unreadCount > 0 && (
                    <span className="flex-shrink-0 bg-[#25D366] text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-sm">
                      {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}