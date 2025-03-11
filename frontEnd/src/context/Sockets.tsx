import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { env } from '../common/env';


const SocketContext = createContext<Socket | null>(null);

const SOCKET_URL = env.BACKEND_API_URL; 
interface SocketProviderProps {
  children: ReactNode; 
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket: Socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket'],
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

// Custom hook to use the socket context
export const useSocket = (): Socket | null => {
  return useContext(SocketContext);
};
