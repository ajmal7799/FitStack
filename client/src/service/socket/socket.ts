import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;
  private joinedRooms: Set<string> = new Set(); // ✅ Track joined rooms
  private messageListeners: Set<Function> = new Set(); // ✅ Track multiple listeners
  private messageDeleteListeners: Set<Function> = new Set(); // ✅ Track delete listeners

  // Initialize socket connection
  connect(token: string, userId: string) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.userId = userId;

    // Replace with your backend URL
    const SOCKET_URL = import.meta.env.VITE_API_BASE_URL;

    this.socket = io(SOCKET_URL, {
      auth: {
        token, // Your JWT token for authentication
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      
      // ✅ Rejoin all rooms after reconnection
      this.joinedRooms.forEach(chatId => {
        this.socket?.emit('join_room', chatId);
        console.log(`🔄 Rejoined room after reconnect: ${chatId}`);
      });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔴 Socket connection error:', error);
    });

    this.socket.on('error', (error) => {
      console.error('🔴 Socket error:', error);
    });

    // Initialize global message listener
    this.socket.on('receive_message', (message) => {
      console.log(`📨 Broadcasting to ${this.messageListeners.size} listeners`);
      this.messageListeners.forEach(listener => {
        try {
          listener(message);
        } catch (error) {
          console.error('Error in message listener:', error);
        }
      });
    });

    // ✅ Listen for message deletion
    this.socket.on('message_deleted', (data: { messageId: string }) => {
      console.log(`🗑️ Message deleted: ${data.messageId}`);
      this.messageDeleteListeners.forEach(listener => {
        try {
          listener(data.messageId);
        } catch (error) {
          console.error('Error in delete listener:', error);
        }
      });
    });
  }

  // Join a chat room
  joinRoom(chatId: string) {
    // ✅ Always track the room, so it auto-joins on connect/reconnect
    if (this.joinedRooms.has(chatId)) {
      console.log(`Already in room (tracking): ${chatId}`);
      if (this.socket?.connected) {
         this.socket.emit('join_room', chatId); 
      }
      return;
    }

    this.joinedRooms.add(chatId);
    console.log(`🏠 Queueing join for room: ${chatId}`);

    if (this.socket?.connected) {
      this.socket.emit('join_room', chatId);
      console.log(`🚀 Emitted join_room for: ${chatId}`);
    } else {
      console.log(`⏳ Socket not connected yet, ${chatId} will be joined on connect`);
    }
  }

  // Leave a chat room
  leaveRoom(chatId: string) {
    if (!this.socket?.connected) return;
    
    this.socket.emit('leave_room', chatId);
    this.joinedRooms.delete(chatId);
    console.log(`🚪 Leaving room: ${chatId}`);
  }

  // Send message
  sendMessage(chatId: string, text: string) {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }

    console.log(`📤 Emitting send_message for room ${chatId}:`, text);
    this.socket.emit('send_message', { chatId, text });
  }

  deleteMessage(messageId: string, chatId: string) {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }
    console.log(`🗑️ Emitting delete_message for message ${messageId} in room ${chatId}`);
    this.socket.emit('delete_message', { messageId, chatId });
  }

  // ✅ FIXED: Listen for incoming messages (support multiple listeners)
  onReceiveMessage(callback: (message: any) => void) {
    // Add callback to the set of listeners
    this.messageListeners.add(callback);
    console.log(`👂 Message listener attached (${this.messageListeners.size} total listeners)`);
  }

  // ✅ NEW: Listen for message deletions
  onMessageDeleted(callback: (messageId: string) => void) {
    this.messageDeleteListeners.add(callback);
    console.log(`👂 Delete listener attached (${this.messageDeleteListeners.size} total listeners)`);
  }

  // Listen for user joined event
  onUserJoined(callback: (data: { userId: string }) => void) {
    if (!this.socket) return;

    this.socket.off('user_joined');
    this.socket.on('user_joined', callback);
  }

  // Remove listener
  removeListener(event: string, callback?: (data: any) => void) {
    if (event === 'receive_message' && callback) {
      this.messageListeners.delete(callback);
      console.log(`👂 Message listener removed (${this.messageListeners.size} remaining listeners)`);
    } else if (event === 'message_deleted' && callback) {
      this.messageDeleteListeners.delete(callback);
      console.log(`👂 Delete listener removed (${this.messageDeleteListeners.size} remaining listeners)`);
    } else if (this.socket && callback) {
      this.socket.off(event, callback);
    } else if (this.socket) {
      this.socket.off(event);
    }
  }

  // Remove all listeners for specific events
  removeAllListeners(event?: string) {
    if (event === 'receive_message') {
      this.messageListeners.clear();
    } else if (event === 'message_deleted') {
      this.messageDeleteListeners.clear();
    } else if (this.socket && event) {
      this.socket.off(event);
    } else if (this.socket) {
      this.messageListeners.clear();
      this.messageDeleteListeners.clear();
      this.socket.off('user_joined');
    }
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.joinedRooms.clear();
      this.messageListeners.clear();
      this.messageDeleteListeners.clear(); // ✅ Clear delete listeners on disconnect
      console.log('🔌 Socket disconnected manually');
    }
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }

  // Check if connected
  isConnected() {
    return this.socket?.connected || false;
  }

  // Get current user ID
  getUserId() {
    return this.userId;
  }

  // ✅ Check if in a room
  isInRoom(chatId: string) {
    return this.joinedRooms.has(chatId);
  }
}

// Export singleton instance
export const socketService = new SocketService();