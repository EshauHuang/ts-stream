import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

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
  "user-disconnected": (username: string) => void;
  "user-connected": (username: string) => void;
  "chat-message": (comment: Comment) => void;
}

interface ClientToServerEvents {
  "join-room": (user: User, room: string) => void;
}

const user = {
  username: "Sans",
};

const Chatroom = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(user);
  const inputRef = useRef(null);
  const roomRef = useRef(null);

  useEffect(() => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:3001");

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socket);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join-room", {
      user: currentUser,
      room: "room1",
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

    setSocket(socket);

    return () => {
      socket.off("chat-message");
    };
  }, [socket]);
  console.log(isConnected);
  return (
    <Container>
      <ViewModeBar>ViewModeBar</ViewModeBar>
      <ChatMessages />
      <SendMessage />
    </Container>
  );
};

export default Chatroom;
