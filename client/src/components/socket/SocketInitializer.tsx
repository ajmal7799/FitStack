// components/socket/SocketInitializer.tsx
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { socketService } from "../../service/socket/socket";
import { useNotificationSocket } from "../../hooks/Socket/useNotificationSocket";
import type { Rootstate } from "../../redux/store";

const SocketInitializer = ({ children }: { children: React.ReactNode }) => {
  const token = useSelector((state: Rootstate) => state.authData.accessToken);
  const userId = useSelector((state: Rootstate) => state.authData._id);

  useEffect(() => {
    if (token && userId) {
      console.log("🔌 Initializing socket globally");
      socketService.connect(token, userId);
    }

    return () => {
      socketService.disconnect();
    };
  }, [token, userId]);

  useNotificationSocket();

  return <>{children}</>;
};

export default SocketInitializer;
