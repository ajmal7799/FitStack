import { Server, Socket } from 'socket.io';
import { ISendingMessageUseCase } from '../../../application/useCase/chat/ISendingMessageUseCase';
import { IDeleteMessagesUseCase } from '../../../application/useCase/chat/IDeleteMessagesUseCase';
import { IEndVideoCallSessionUseCase } from '../../../application/useCase/video/IEndVideoCallSessionUseCase';

export class SocketController {
  private io: Server;
  private _sendingMessageUseCase: ISendingMessageUseCase;
  private _deleteMessageUseCase: IDeleteMessagesUseCase;
  private _endVideoCallSessionUseCase: IEndVideoCallSessionUseCase;
  constructor(io: Server, sendingMessageUseCase: ISendingMessageUseCase, deleteMessageUseCase: IDeleteMessagesUseCase, endVideoCallSessionUseCase: IEndVideoCallSessionUseCase) {
    this.io = io;
    this._sendingMessageUseCase = sendingMessageUseCase;
    this._deleteMessageUseCase = deleteMessageUseCase;
    this._endVideoCallSessionUseCase = endVideoCallSessionUseCase;
  }

  public onConnection(socket: Socket) {
    const userId = socket.data.userId;
    console.log(`📡 New connection established for user: ${userId}`);

    socket.on('join_room', (chatId: string) => {
      if (!chatId) {
        console.log('⚠️ Join attempt failed: No chatId provided');
        return;
      }

      socket.join(chatId);

      console.log(`🏠 User [${userId}] joined Room [${chatId}]`);

      socket.to(chatId).emit('user_joined', { userId });
    });

    // --------------------------------------------------
    //              🛠 SEND MESSAGE LOGIC
    // --------------------------------------------------
    socket.on('send_message', async (data: { chatId: string; text: string }) => {
      try {
        const { chatId, text } = data;
        console.log(`📩 Received message from ${userId} in room ${chatId}:`, text);

        if (!text || text.trim() === '') {
          console.log('⚠️ Empty message ignored');
          return;
        }

        await socket.join(chatId);

        const savedMessage = await this._sendingMessageUseCase.sendMessage(chatId, userId, text);
        console.log(`✅ Message saved, broadcasting to room ${chatId}`);

        this.io.to(chatId).emit('receive_message', savedMessage);
      } catch (error) {
        console.error('❌ Error handling send_message:', error);
        socket.emit('error', 'Message could not be sent');
      }
    });

    socket.on('delete_message', async (data: { messageId: string; chatId: string }) => {
      try {
        const { messageId, chatId } = data;
        console.log(`🗑️ Received delete request for message ${messageId} from user ${userId}`);

        await this._deleteMessageUseCase.execute(messageId, userId);
        await socket.join(chatId);
        this.io.to(chatId).emit('message_deleted', { messageId });
      } catch (error) {
        console.error('❌ Error handling delete_message:', error);
        socket.emit('error', 'Message could not be deleted');
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 User ${userId} disconnected`);
    });

    // --------------------------------------------------
    //              🛠 VIDEO CALL 
    // --------------------------------------------------

    socket.on('video_call:join', ({ roomId, userId,slotId }: { roomId: string; userId: string,slotId: string }) => {
      console.log("🎥 User [${userId}] joined Video Room [${roomId}]");
      if (!roomId) return;

      socket.data.userId = userId;
      socket.data.roomId = roomId;
      socket.data.slotId = slotId;

      socket.join(roomId);
      console.log(`🎥 User [${userId}] joined Video Room [${roomId}]`);

      // Notify the other user in the room that a peer has arrived.
      // This is the "trigger" for Peer A to start the WebRTC handshake.
      socket.to(roomId).emit('video_call:peer_joined', { userId });
    });

    // 2. SIGNAL RELAY (The "Mailman")
    socket.on('video_call:signal', (data: { roomId: string; signalData: any }) => {
      const { roomId, signalData } = data;

      // Take the WebRTC data from Peer A and send it directly to Peer B.
      // We use socket.to(roomId) to ensure the sender doesn't receive their own signal.
      socket.to(roomId).emit('video_call:signal', signalData);
    });


    // 3. LEAVE VIDEO ROOM
    socket.on('video_call:leave', async ({ roomId }: { roomId: string }) => {
      socket.leave(roomId);

      const userId = socket.data.userId;
      const slotId = socket.data.slotId;
      console.log("slotId", slotId, userId);

      const remaining = (await this.io.in(roomId).allSockets()).size;
      if(remaining === 0) {
        this._endVideoCallSessionUseCase.execute(slotId);
      }

      // Notify others so they can close the connection on their end
      socket.to(roomId).emit('video_call:peer_left');
    });
  }
}
