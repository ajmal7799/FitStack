import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Paperclip, MoreVertical, Loader2, Trash2, X, FileText, Play } from 'lucide-react';
import { useGetMessages, useMarkAsRead, useUploadAttachment } from '../../hooks/chat/chatHooks';
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

interface MessageAttachment {
    key: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    url?: string;
}

interface Message {
    _id: string;
    chatId: string;
    senderId: string;
    type: 'text' | 'image' | 'file' | 'video' | 'audio';
    text?: string;
    attachment?: MessageAttachment;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: string;
}

interface GetMessagesResponse {
    success: boolean;
    message: string;
    data: { messages: Message[] };
}

export default function ChatWindow({ chatId, userName, userProfilePic, onMessageSent }: ChatWindowProps) {
    const currentUserId = useSelector((state: Rootstate) => state.authData._id);
    const [messageInput, setMessageInput] = useState('');
    const [uploadingFile, setUploadingFile] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; messageId: string | null }>({
        isOpen: false,
        messageId: null
    });

    const { data, isLoading, isError, error, refetch } = useGetMessages(chatId);
    const markAsReadMutation = useMarkAsRead();
    const uploadAttachment = useUploadAttachment();

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    const messagesData = data as GetMessagesResponse | undefined;
    const apiMessages: Message[] = messagesData?.data?.messages || [];
    const allMessages = apiMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    useEffect(() => { scrollToBottom(); }, [allMessages]);

    useEffect(() => {
        if (chatId) markAsReadMutation.mutate(chatId);
    }, [chatId]);

    // --- DELETE ---
    const openDeleteModal = (messageId: string) => setDeleteModal({ isOpen: true, messageId });
    const closeDeleteModal = () => setDeleteModal({ isOpen: false, messageId: null });
    const confirmDelete = () => {
        if (deleteModal.messageId && socketService.isConnected()) {
            socketService.deleteMessage(deleteModal.messageId, chatId);
            closeDeleteModal();
        }
    };

    // --- SOCKET HANDLERS ---
    const handleChatWindowMessage = useCallback((message: Message) => {
        if (message.chatId === chatId) {
            onMessageSent?.(chatId, message.text || message.attachment?.fileName || '', message.senderId, message.createdAt);
            setTimeout(() => refetch(), 500);
            markAsReadMutation.mutate(chatId);
        }
    }, [chatId, markAsReadMutation, refetch, onMessageSent]);

    const handleMessageDeleted = useCallback(() => { refetch(); }, [refetch]);

    useChatSocket(handleChatWindowMessage);

    useEffect(() => {
        socketService.onMessageDeleted(handleMessageDeleted);
        return () => { socketService.removeListener('message_deleted', handleMessageDeleted); };
    }, [handleMessageDeleted]);

    // --- SEND TEXT ---
    const handleSendMessage = () => {
        if (!messageInput.trim()) return;
        socketService.sendMessage(chatId, messageInput.trim(), 'text');
        onMessageSent?.(chatId, messageInput.trim());
        setMessageInput('');
        setTimeout(() => refetch(), 500);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
    };

    // --- SEND ATTACHMENT ---
   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
        const attachment = await uploadAttachment.mutateAsync({ chatId, file });
        console.log('📎 attachment:', JSON.stringify(attachment));

        const type = file.type.startsWith('image/') ? 'image'
            : file.type.startsWith('video/') ? 'video'
            : file.type.startsWith('audio/') ? 'audio'
            : 'file';

        socketService.sendMessage(chatId, undefined, type, attachment);
        onMessageSent?.(chatId, type === 'image' ? '📷 Image' : type === 'video' ? '🎥 Video' : '📄 File');
        setTimeout(() => refetch(), 500);
    } catch (err) {
        console.error('❌ File upload failed:', err); // ← check this in console
        alert('Failed to send attachment. Please try again.'); // ← temporary for debugging
    } finally {
        setUploadingFile(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
};

    // --- HELPERS ---
    const isMyMessage = (senderId: string) => senderId === currentUserId;

    const getDeletedMessageText = (msg: Message) =>
        isMyMessage(msg.senderId) ? 'You deleted this message' : 'This message was deleted';

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
        if (messageDate.getTime() === today.getTime()) return 'Today';
        if (messageDate.getTime() === yesterday.getTime()) return 'Yesterday';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
    };

    // --- RENDER ATTACHMENT ---
    const renderAttachment = (msg: Message, isSent: boolean) => {
        const { attachment, type } = msg;
        if (!attachment) return null;

        if (type === 'image') {
            return attachment.url ? (
                <img
                    src={attachment.url}
                    alt={attachment.fileName}
                    className="max-w-[220px] rounded-lg cursor-pointer"
                    onClick={() => window.open(attachment.url, '_blank')}
                />
            ) : (
                <div className="text-xs text-gray-400 italic">Image unavailable</div>
            );
        }

        if (type === 'audio') {
    return attachment.url ? (
        <audio controls className="max-w-[220px]">
            <source src={attachment.url} type={attachment.fileType} />
            Your browser does not support audio.
        </audio>
    ) : <div className="text-xs text-gray-400 italic">Audio unavailable</div>;
}

        if (type === 'video') {
            return attachment.url ? (
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.open(attachment.url, '_blank')}>
                    <Play className="w-5 h-5" />
                    <div>
                        <p className="text-sm font-medium">{attachment.fileName}</p>
                        <p className={`text-xs ${isSent ? 'text-blue-100' : 'text-gray-400'}`}>{formatFileSize(attachment.fileSize)}</p>
                    </div>
                </div>
            ) : null;
        }

        // Generic file
        return (
            <div
                className={`flex items-center gap-2 cursor-pointer ${attachment.url ? '' : 'opacity-50 cursor-default'}`}
                onClick={() => attachment.url && window.open(attachment.url, '_blank')}
            >
                <FileText className="w-5 h-5 flex-shrink-0" />
                <div>
                    <p className="text-sm font-medium break-all">{attachment.fileName}</p>
                    <p className={`text-xs ${isSent ? 'text-blue-100' : 'text-gray-400'}`}>{formatFileSize(attachment.fileSize)}</p>
                </div>
            </div>
        );
    };

    // --- RENDER MESSAGES ---
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

                    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2 group px-2`}>
                        <div className={`flex items-center gap-2 max-w-[80%] ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>

                            <div className={`px-4 py-2 rounded-2xl shadow-sm ${
                                msg.isDeleted
                                    ? 'bg-gray-100 border border-gray-200'
                                    : isSent
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                            }`}>
                                {msg.isDeleted ? (
                                    <p className="text-sm italic text-gray-500 flex items-center gap-2">
                                        <Trash2 className="w-3 h-3" />
                                        {getDeletedMessageText(msg)}
                                    </p>
                                ) : (
                                    <>
                                        {msg.type === 'text'
                                            ? <p className="text-sm break-words">{msg.text}</p>
                                            : renderAttachment(msg, isSent)
                                        }
                                        <span className={`text-[10px] mt-1 block text-right ${isSent ? 'text-blue-100' : 'text-gray-400'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </>
                                )}
                            </div>

                            {isSent && !msg.isDeleted && (
                                <button
                                    onClick={() => openDeleteModal(msg._id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full transition-all duration-200"
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
            {/* Delete Modal */}
            {deleteModal.isOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Delete Message?</h3>
                            <button onClick={closeDeleteModal}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <p className="text-gray-500 text-sm mb-6">
                            Are you sure you want to delete this message? This will delete it for both you and {userName}.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={closeDeleteModal} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button onClick={confirmDelete} className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="p-4 border-b bg-white flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    {userProfilePic ? (
                        <img src={userProfilePic} alt={userName} className="w-10 h-10 rounded-full object-cover border-2 border-gray-200" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-gray-900">{userName}</h3>
                        <p className="text-xs">
                            {socketService.isConnected()
                                ? <span className="text-green-500">● Online</span>
                                : <span className="text-gray-400">● Offline</span>}
                        </p>
                    </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : isError ? (
                    <div className="flex items-center justify-center h-full text-red-500 text-sm">
                        {error instanceof Error ? error.message : 'Error loading messages'}
                    </div>
                ) : allMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        No messages yet. Say hello!
                    </div>
                ) : renderMessagesWithDates()}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip" 
                    onChange={handleFileChange}
                />
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingFile || !socketService.isConnected()}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                        title="Attach file"
                    >
                        {uploadingFile
                            ? <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                            : <Paperclip className="w-5 h-5 text-gray-600" />
                        }
                    </button>
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={uploadingFile ? 'Uploading...' : 'Type a message...'}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading || uploadingFile || !socketService.isConnected()}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() || isLoading || uploadingFile || !socketService.isConnected()}
                        className={`p-3 rounded-full transition-all ${
                            messageInput.trim() && !isLoading && !uploadingFile && socketService.isConnected()
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