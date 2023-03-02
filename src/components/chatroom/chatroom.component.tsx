import { useState, useEffect, useRef, useContext, useMemo } from "react";
import { io, Socket } from "socket.io-client";

import { CommentsContext, IComment } from "@/contexts/commentsContext";
import { CommentsProvider } from "@/contexts/commentsContext";

import ChatMessages from "@/components/chat-messages/chat-messages.component";
import SendMessage from "@/components/send-message/send-message.component";

import { IStreamMeta } from "@/routes/live/live.component";

import { Container, ViewModeBar } from "./chatroom.style";

interface User {
  username: string;
}

interface ServerToClientEvents {
  connect: () => void;
  "chat-message": (comment: IComment) => void;
  "stream-connected": ({ videoId }: { videoId: string }) => void;
}

interface ClientToServerEvents {
  "new-user": (user: User, roomName: string) => void;
}

const user = {
  username: "Sans",
};

interface IChatroomProps {
  roomName?: string;
  comments?: IComment[];
  setStream?: React.Dispatch<React.SetStateAction<IStreamMeta>>;
}

const Chatroom: React.FC<IChatroomProps> = ({
  roomName,
  setStream,
  comments,
}) => {
  const { sendCommentByUser, setCurrentComments } = useContext(CommentsContext);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => user);

  useEffect(() => {
    if (!roomName) return;

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      `${import.meta.env.VITE_SERVER_URL}`
    );

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.emit("new-user", currentUser, roomName);

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("chat-message", (comment) => {
      sendCommentByUser(comment);
    });

    socket.on("stream-connected", ({ videoId }) => {
      if (!setStream) return;

      console.log("stream connected");
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
      socket.off("connect");
      socket.off("chat-message");
      socket.off("disconnect");
    };
  }, [roomName]);

  useEffect(() => {
    if (!comments || !comments.length) return;
    setCurrentComments(comments);
  }, [comments]);

  return (
    <Container>
      <ViewModeBar>Stream Chat</ViewModeBar>
      <ChatMessages />
      <SendMessage socket={socket} />
    </Container>
  );
};

const ChatRoomProvider = (props: IChatroomProps) => (
  <CommentsProvider>
    <Chatroom {...props} />
  </CommentsProvider>
);

export default ChatRoomProvider;
