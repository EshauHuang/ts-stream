import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import * as fs from "fs";

const PORT = 3535;

let isStreamOn = false;

const video = {};

class Comments {
  constructor() {
    this.length = 0;
    this.createTime = Date.now();
  }
  addComment(user, text) {
    if (!user || !text) return;
    this[this.length] = {
      user,
      text,
      time: new Date().getTime(),
    };
    this.length++;
  }
  showComments() {
    return this;
  }
}

class Users {
  constructor() {
    this.length = 0;
    this.createTime = Date.now();
  }
  addUser(socketId, user) {
    if (!socketId || !user) return;
    this[socketId] = { user };
    this.length++;
  }
  removeUser(socketId) {
    if (!socketId || !this[socketId]) return;
    delete this[socketId];
    this.length--;
  }
}

class Rooms {
  constructor() {
    this.length = 0;
  }
  addRoom(room) {
    if (this[room]) return;
    this[room] = {
      users: new Users(),
      comments: new Comments(),
    };
    this.length++;
  }
  addUserToRoom(room, socketId, user) {
    if (!room || !socketId || !user) return;
    this.addRoom(room);
    this[room].users.addUser(socketId, user);
  }
  removeUserFromRoom(room, socketId) {
    if (!room || !socketId) return;
    this[room].users.removeUser(socketId);
  }
  addCommentToRoom(room, message, user) {
    if (!room || !message || user) {
      this.addRoom(room);
      this[room].comments.addComment(message, user);
    }
  }
  showRoomComments(room) {
    return this[room].comments.showComments();
  }
}

const rooms = new Rooms();
const users = new Users();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// app.io = io;

app.post("/rtmp/on_publish", (req, res) => {
  //get
  isStreamOn = true;
  console.log("POST/on_publish");
  io.to("room1").emit("stream-connected");
  res.status(204).send("Success!");
});

app.post("/rtmp/on_publish_done", async (req, res) => {
  isStreamOn = false;
  console.log("POST/on_publish_done");

  try {
    const json = JSON.stringify({
      room1: {
        comments: rooms["room1"].comments,
      },
    });
    await fs.promises.writeFile("comments.json", json);
    res.send("success");
  } catch (error) {
    res.send("failed");
  }
});

app.get("/check-stream", (req, res) => {
  res.send(isStreamOn);
});

io.on("connection", (socket) => {
  socket.on("join-room", ({ user, room }) => {
    socket.join(room);

    currentRoomToDo((room) => {
      socket.to(room).emit("new-user", user);
    });

    rooms.addUserToRoom(room, socket.id, user);

    users.addUser(socket.id, user);
  });

  socket.on("send-message", (message, callback) => {
    const { user } = users[socket.id];

    currentRoomToDo((room) => {
      socket.to(room).emit("chat-message", {
        user,
        message,
      });

      rooms.addCommentToRoom(room, user, message);
      console.log(rooms.showRoomComments(room));

      if (!callback) return;
      callback({
        status: "ok",
      });
    });
  });

  socket.on("disconnecting", function () {
    const { user } = users[socket.id];

    currentRoomToDo((room) => {
      socket.to(room).emit("user-left", user);
      rooms.removeUserFromRoom(room, socket.id);
    });

    users.removeUser(socket.id);
  });

  function currentRoomToDo(func) {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        func(room);
      }
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
