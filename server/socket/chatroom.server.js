import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import CryptoJS from "crypto-js";

const SECRET_KEY = "testtest";

const PORT = 3535;

// 網站總共有多少部影片
const siteVideos = {
  0: {
    title: "",
    content: "",
  },
  1: {},
  length: 2,
  createInitVideo() {
    const id = this.length;
    this[id] = {};

    this.length++;

    return id;
  },
  update(id, video) {
    this[id] = video;

    return id;
  },
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
    streamKey: "U2FsdGVkX1/5NVvBrPwm01j8Ww0RFc8t/Nkyty1L85g=",
    videos: {
      0: {
        // 關聯到 siteVideosID
      },
      length: 1,
      addVideo(video) {
        const index = this.length;
        this[index] = video;
        this.length++;

        return { [index]: this[index] };
      },
    },
    stream: {
      isStreamOn: false,
      title: "",
      content: "",
    },
  },
];

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
    this[room].users.addUser(socketId, user);
  }
  removeUserFromRoom(room, socketId) {
    if (!room || !socketId) return;
    this[room].users.removeUser(socketId);
  }
  addCommentToRoom(room, message, user) {
    if (!room || !message || !user) {
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

app.post("/auth/on_publish", (req, res) => {
  console.log("驗證 stream key '/auth/on_publish");
  const { name: streamKeyHex } = req.body;

  // 判斷 streamKey 是否為此網站產生的

  // 收到的 stream key 為 16 進位字串，需要解碼後再解析
  const streamKey = CryptoJS.enc.Hex.parse(streamKeyHex).toString(
    CryptoJS.enc.Base64
  );

  const username = CryptoJS.AES.decrypt(streamKey, SECRET_KEY).toString(
    CryptoJS.enc.Utf8
  );

  // 非網站產生 stream key(secret key 不同)
  if (!username) {
    console.log("stream key 驗證失敗");
    return res.status(500).send("stream key was wrong");
  }
  // 確認是否有該 user
  const user = usersTable.find((user) => user.username === username);

  if (!user) {
    console.log("無此 user");
    return res.status(500).send("stream key was wrong");
  }

  console.log("驗證成功！");
  // 建立新的 video 並取得 videoId
  const videoId = siteVideos.createInitVideo();

  // 利用新的 streamKey(videoId) 推到 nginx，同時需要推送 username，nginx 會自動將 params(username) 當成 post data 傳至 on_publish 及 on_publish_done
  res
    .status(302)
    .redirect(
      `rtmp://192.168.64.2:1935/hls_live/${videoId}?username=${username}`
    );
});

app.post("/rtmp/on_publish", (req, res) => {
  console.log("直播開始 'on_publish");
  const { username } = req.body;
  const user = usersTable.find((user) => user.username === username);

  // 直播狀態改為 on，用於使用者進入直播間時可自動去抓取直播資源
  user.stream.isStreamOn = true;

  // 傳送直播開始訊息，用於刷新影片
  io.to(username).emit("stream-connected");

  res.status(204);
});

app.post("/rtmp/on_publish_done", async (req, res) => {
  console.log("直播結束 'on_publish_done'");
  const { name: videoId, username } = req.body;

  // 取得此 streamKey 的擁有者
  const user = usersTable.find((user) => user.username === username);
  // room 名稱與 username 相同，取得此 room 的 comments
  const { comments } = rooms[username];

  // 將此直播紀錄(影片、聊天室)儲存在 siteVideos 內
  siteVideos.update(videoId, {
    title: user.stream.title,
    content: user.stream.content,
    comments,
  });

  // 將影片加至 user 的 videos 內
  user.videos.addVideo({
    videoId,
    title: user.stream.title,
    content: user.stream.content,
    comments,
  });

  user.stream.isStreamOn = false;

  res.status(204);
});

// curl -d '{"username":"user01", "key2":"value2"}' -H "Content-Type: application/json" -X POST http://localhost:3535/u/user01/create-stream

// 初次建立直播間，未建立直播間則無法開實況
app.post("/u/:username/stream-room", (req, res) => {
  console.log(req.body);
  // const { username, title, content } = req.body;
  // const user = usersTable.find((user) => user.streamKey === streamKey);

  // console.log("query", query);
  res.send("success");
});

// curl -d '{"username":"user01", "key2":"value2"}' -H "Content-Type: application/json" -X POST http://localhost:3535/get-stream

app.post("/get-stream", (req, res) => {
  const { username } = req.body;
  if (!username) return;

  const user = usersTable.find((user) => user.username === username);
  res.json(user.stream);
});

io.on("connection", (socket) => {
  // 假設直播室已建立
  rooms.addRoom("user01");

  socket.on("new-user", (user, roomName) => {
    socket.join(roomName);

    rooms.addUserToRoom(roomName, socket.id, user);

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
