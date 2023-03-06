import { useState, useEffect, useContext } from "react";
import { io, Socket } from "socket.io-client";

import { UserContext } from "@/contexts/userContext";

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
  "user-connect": (user: User | null, roomName: string) => void;
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
  const {
    addNewComment,
    addNewDelayComments,
  } = useContext(CommentsContext);
  const { currentUser } = useContext(UserContext);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { username } = currentUser || {};
  useEffect(() => {
    if (!roomName) return;

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      `${import.meta.env.VITE_SERVER_URL}`
    );

    socket.on("connect", () => {
      setIsConnected(true);
    });

    if (username) {
      socket.emit("user-connect", { username }, roomName);
    } else {
      socket.emit("user-connect", null, roomName);
    }

    // socket.emit("new-user", currentUser, roomName);

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("chat-message", (comment) => {
      addNewComment(comment);
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
      <ChatMessages/>
      <SendMessage socket={socket} />
    </Container>
  );
};

const ChatRoomProvider = (props: IChatroomProps) => (
  <CommentsProvider>
    <Chatroom {...props} />
  </CommentsProvider>
);

export default Chatroom;
