import { Server, Socket } from 'socket.io';
import { ISendingMessageUseCase } from '../../../application/useCase/chat/ISendingMessageUseCase';
import { IDeleteMessagesUseCase } from '../../../application/useCase/chat/IDeleteMessagesUseCase';

export class SocketController {
  private io: Server;
  private _sendingMessageUseCase: ISendingMessageUseCase;
  private _deleteMessageUseCase: IDeleteMessagesUseCase;
  constructor(io: Server, sendingMessageUseCase: ISendingMessageUseCase, deleteMessageUseCase: IDeleteMessagesUseCase) {
    this.io = io;
    this._sendingMessageUseCase = sendingMessageUseCase;
    this._deleteMessageUseCase = deleteMessageUseCase;
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

    socket.on('delete_message', async (data: { messageId: string, chatId: string }) => {
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
  }
}
