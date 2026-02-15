import { useEffect } from 'react';
import { socketService } from '../../service/socket/socket';

export const useChatSocket = (callback: (message: any) => void) => {
  useEffect(() => {
    socketService.onReceiveMessage(callback);

    return () => {
      socketService.removeListener('receive_message', callback);
    };
  }, [callback]);
};
