import { rooms, TCommentInfo, TAuthorInfo } from "../models/stream";
import { Server } from "socket.io";
import _ from "lodash-es"

export type TCommentAuthorInfo = {
  username: string;
};

export type TMessage = {
  text: string;
};

export interface ServerToClientEvents {
  "chat-message": (comment: TCommentInfo) => void;
}

export interface ClientToServerEvents {
  "stream-connected": ({ videoId }: { videoId: string }) => void;
  "send-message": (message: string, callback: ({ status }: { status: string }) => void) => void;
  "user-connect": (user: TAuthorInfo, roomName: string) => void;
}

export interface InterServerEvents { }

export interface SocketData { }

export const startIo = (io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
  io.on("connection", (socket) => {
    socket.on("user-connect", (user: TAuthorInfo, roomName: string) => {
      socket.join(roomName);

      if (user) {
        rooms.addUserToRoom(roomName, socket.id, user);
      }
    });

    socket.on("send-message", (message: string, callback: ({ status }: { status: string }) => void) => {
      currentRoomToDo((room: string) => {
        try {
          const comment = rooms.addCommentToRoom(room, message, socket.id);

          io.in(room).emit("chat-message", comment);

          if (!callback) return;
          callback({
            status: "ok",
          });
        } catch (error) {
          if (error instanceof Error) {
            const { message } = error;
            console.log("error", message);
          } else {
            console.log("Unexpected error");
          }

        }
      });
    });

    socket.on("disconnecting", async function () {
      currentRoomToDo((room: string) => {
        rooms.removeUserFromRoom(room, socket.id);
      });
    });

    function currentRoomToDo(func: (room: string) => void) {
      for (const room of socket.rooms) {
        if (room !== socket.id) {
          func(room);
        }
      }
    }
  });
};
