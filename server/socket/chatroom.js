import { rooms } from "../index.js";

export const startIo = (io) => {
  io.on("connection", (socket) => {

    socket.on("user-connect", (user, roomName) => {
      socket.join(roomName);

      if (user) {
        rooms.addUserToRoom(roomName, socket.id, user);
      }
    });

    socket.on("send-message", (message, callback) => {
      currentRoomToDo((room) => {
        const comment = rooms.addCommentToRoom(room, message, socket.id);

        io.in(room).emit("chat-message", comment);

        if (!callback) return;
        callback({
          status: "ok",
        });
      });
    });

    socket.on("disconnecting", async function () {
      currentRoomToDo((room) => {
        rooms.removeUserFromRoom(room, socket.id);
      });
    });

    function currentRoomToDo(func) {
      for (const room of socket.rooms) {
        if (room !== socket.id) {
          func(room);
        }
      }
    }
  });
};
