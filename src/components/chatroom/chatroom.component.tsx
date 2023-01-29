import { useState, useEffect, useRef, useContext } from "react";
import { io, Socket } from "socket.io-client";

import { MessagesContext } from "@/contexts/messagesContext";

import ChatMessages from "@/components/chat-messages/chat-messages.component";
import SendMessage from "@/components/send-message/send-message.component";

import { Container, ViewModeBar } from "./chatroom.style";

interface User {
  username: string;
}

interface Comment {
  user: User;
  message: string;
}

interface ServerToClientEvents {
  connect: () => void;
  "chat-message": (comment: Comment) => void;
  "stream-connected": (isStreamOn: boolean) => void;
}

interface ClientToServerEvents {
  "new-user": (user: User, roomName: string) => void;
}

const user = {
  username: "Sans",
};

interface IChatroomProps {
  roomName: string;
}

const Chatroom: React.FC<IChatroomProps> = ({ roomName, setStream }) => {
  const { sendMessageByUser } = useContext(MessagesContext);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => user);

  useEffect(() => {
    if (!roomName) return;

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      "http://192.168.50.224:3535"
    );

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.emit("new-user", currentUser, roomName);

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("chat-message", ({ user, message }) => {
      // setComments((prev) => [
      //   ...prev,
      //   {
      //     user,
      //     message,
      //   },
      // ]);
    });
    socket.on("stream-connected", () => {
      console.log("stream connected");
      setStream((prev) => ({
        ...prev,
        isStreamOn: true,
      }));
      // setIsStreamOn(true);
    });

    setSocket(socket);

    return () => {
      socket.off("connect");
      socket.off("chat-message");
      socket.off("disconnect");
    };
  }, [roomName]);

  return (
    <Container>
      <ViewModeBar>ViewModeBar</ViewModeBar>
      <ChatMessages />
      <SendMessage socket={socket} />
    </Container>
  );
};

export default Chatroom;
