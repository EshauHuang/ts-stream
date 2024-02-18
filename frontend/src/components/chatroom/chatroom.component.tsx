import { useState, useEffect, useContext } from "react";
import { io, Socket } from "socket.io-client";

import { UserContext } from "@/contexts/userContext";
import { CommentsContext, TCommentInfo } from "@/contexts/commentsContext";

import ChatMessages from "@/components/chat-messages/chat-messages.component";
import SendMessage from "@/components/send-message/send-message.component";
import { IStreamData } from "@/routes/stream/stream.component";

import { Container, ViewModeBar } from "./chatroom.style";

interface User {
  username: string;
}

interface ServerToClientEvents {
  connect: () => void;
  "chat-message": (comment: TCommentInfo) => void;
  "stream-connected": ({ videoId }: { videoId: string }) => void;
}

interface ClientToServerEvents {
  "user-connect": (user: User | null, roomName: string) => void;
}

interface IChatroomProps {
  isStream: boolean;
  roomName?: string;
  comments?: TCommentInfo[];
  setStream?: React.Dispatch<React.SetStateAction<IStreamData>>;
}

const Chatroom: React.FC<IChatroomProps> = ({
  isStream,
  roomName,
  setStream,
  comments,
}) => {
  const { addNewComment, addNewDelayComments } = useContext(CommentsContext);
  const { currentUser } = useContext(UserContext);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { username } = currentUser || {};
  
  useEffect(() => {
    if (!roomName) return;

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      `${import.meta.env.VITE_SOCKET_URL}`
    );

    socket.on("connect", () => {
      setIsConnected(true);
    });

    if (username) {
      socket.emit("user-connect", { username }, roomName);
    } else {
      socket.emit("user-connect", null, roomName);
    }

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("chat-message", (comment) => {
      addNewComment(comment);
    });

    socket.on("stream-connected", ({ videoId }) => {
      console.log("stream connected");
      if (!setStream) return;

      setStream((prev) => ({
        ...prev,
        stream: {
          ...prev.stream,
          isStreamOn: true,
          videoId,
        },
      }));
    });

    setSocket(socket);

    return () => {
      socket.off();
      socket.disconnect();
    };
  }, [roomName, username]);

  useEffect(() => {
    if (!comments || !comments.length) return;
    addNewDelayComments(comments);
  }, [comments]);

  return (
    <Container>
      <ViewModeBar>Stream Chat</ViewModeBar>
      <ChatMessages />
      {isStream && <SendMessage socket={socket} />}
    </Container>
  );
};

export default Chatroom;
