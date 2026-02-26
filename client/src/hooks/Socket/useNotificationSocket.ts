import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { socketService } from '../../service/socket/socket';
import { addNotification } from '../../redux/slice/notificationSlice';
import type { Rootstate } from '../../redux/store';
import { useQueryClient } from '@tanstack/react-query';

export const useNotificationSocket = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const userId = useSelector((state: Rootstate) => state.authData._id);
  const handlerRef = useRef<((notification: any) => void) | null>(null);

  useEffect(() => {
    if (!userId) return;

    // ✅ Remove previous listener before adding new one
    if (handlerRef.current) {
      socketService.removeListener('receive_notification', handlerRef.current);
    }

    const handleNotification = (notification: any) => {
      console.log('🔔 Real-time notification received:', notification);
      dispatch(addNotification(notification));
      
      // ✅ Also invalidate React Query cache to keep everything in sync
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    };

    handlerRef.current = handleNotification;
    socketService.onReceiveNotification(handleNotification);

    return () => {
      if (handlerRef.current) {
        socketService.removeListener('receive_notification', handlerRef.current);
        handlerRef.current = null;
      }
    };
  }, [dispatch, userId]);
};