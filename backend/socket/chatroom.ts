import { rooms } from "../models/stream";

import { TAuthorInfo } from "../models/stream"

export const startIo = (io: any) => {
  io.on("connection", (socket: any) => {

    socket.on("user-connect", (user: TAuthorInfo, roomName: string) => {
      socket.join(roomName);

      if (user) {
        rooms.addUserToRoom(roomName, socket.id, user);
      }
    });

    socket.on("send-message", (message: string, callback: ({ status }: { status: string }) => void) => {
      currentRoomToDo((room: any) => {
        const comment = rooms.addCommentToRoom(room, message, socket.id);

        io.in(room).emit("chat-message", comment);

        if (!callback) return;
        callback({
          status: "ok",
        });
      });
    });

    socket.on("disconnecting", async function () {
      currentRoomToDo((room: string) => {
        rooms.removeUserFromRoom(room, socket.id);
      });
    });

    function currentRoomToDo(func: (room: any) => void) {
      for (const room of socket.rooms) {
        if (room !== socket.id) {
          func(room);
        }
      }
    }
  });
};
