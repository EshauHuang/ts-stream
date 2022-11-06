import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import * as fs from "fs";

const PORT = 3535;

// 網站總共有多少部影片
const siteVideos = {
  0: {},
  1: {},
  length: 2,
};

// 使用過的 streamKeys
const streamKeys = {
  sdada: 1,
};

// 儲存每個用戶的資訊
const usersTable = [
  {
    id: 0,
    username: "user01",
    streamKey: "test",
    videos: {
      0: {
        // 關聯到 siteVideosID
      },
    },
    stream: {
      isStreamOn: false,
      title: "",
      content: "",
    },
  },
];

const currentStreamOptions = {
  type: "stream",
  isStreamOn: false,
  user: { username: "user01" },
  title: "第一個直播",
  content: "第一個直播",
};

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

app.post("/rtmp/on_publish", (req, res) => {
  const { name: streamKey } = req.body;
  const user = usersTable.find((user) => user.streamKey === streamKey);

  console.log("streaming user", user);
  user.stream.isStreamOn = true;
  console.log("streaming user 2", user);
  io.to(streamKey).emit("stream-connected");
  res.status(204).send("Success!");
});

app.post("/rtmp/on_publish_done", async (req, res) => {
  currentStreamOptions.isStreamOn = false;
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

app.post("/get-stream", (req, res) => {
  const { username } = req.body;
  const { stream } = usersTable.find((user) => user.username === username);
  res.json(stream);
});

io.on("connection", (socket) => {
  socket.on("new-user", (user, roomName) => {
    socket.join(roomName);

    currentRoomToDo((room) => {
      socket.to(room).emit("new-user", user);
    });
    rooms.addUserToRoom(roomName, socket.id, user);

    users.addUser(socket.id, user);
    // console.log(users, rooms)
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
    // const { user } = users[socket.id];
    // currentRoomToDo((room) => {
    //   socket.to(room).emit("user-left", user);
    //   rooms.removeUserFromRoom(room, socket.id);
    // });
    // users.removeUser(socket.id);
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
