import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import CryptoJS from "crypto-js";
import bcrypt from "bcrypt";
import * as _ from "lodash-es";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = "testtest";
const saltRounds = 10;
const PORT = 3535;

// 網站總共有多少部影片
const siteVideos = {
  0: {
    title: "Learn Web Components In 25 Minutes",
    author: "Web Dev Simplified",
    content: "asdsadsa",
    thumbnail: "/1.jpg",
  },
  1: {
    title: "how programmers overprepare for job interviews",
    author: "Joma Tech",
    content: "asdsadsa",
    thumbnail: "/2.jpg",
  },
  2: {
    title: "年薪300萬工程師辭職重考醫學系 醫: 腦袋壞掉",
    author: "蒼藍鴿的醫學天地",
    content: "asdsadsa",
    thumbnail: "/2.jpg",
  },
  3: {
    title:
      "【中文配音心得26-鬼滅之刃遊廓篇(下)】台灣聲優竭盡全力的嘶吼，童磨的聲線帥到出水！",
    author: "台灣聲優研究所",
    content: "asdsadsa",
    thumbnail: "/2.jpg",
  },
  4: {
    title:
      "Git for Professionals Tutorial - Tools & Concepts for Mastering Version Control with Git",
    author: "freeCodeCamp.org",
    content: "asdsadsa",
    thumbnail: "/2.jpg",
  },
  5: {
    title: "是什麼讓事情變得「卡夫卡式」？　諾亞.泰夫林",
    author: "TED-Ed",
    content: "asdsadsa",
    thumbnail: "/1.jpg",
  },
  6: {
    title: "【アニメ】あっははインドネシア〜！",
    author: "hololive ホロライブ - VTuber Group",
    content: "asdsadsa",
    thumbnail: "/3.jpg",
  },
  7: {
    title: "星街すいせい - みちづれ / THE FIRST TAKE",
    author: "THE FIRST TAKE",
    content: "asdsadsa",
    thumbnail: "/3.jpg",
  },
  8: {
    title: "CCC",
    author: "AAA",
    content: "asdsadsa",
    thumbnail: "/3.jpg",
  },
  9: {
    title: "DDDD",
    author: "AAA",
    content: "asdsadsa",
    thumbnail: "/3.jpg",
  },
  10: {
    title: "adasdas",
    author: "AAA",
    content: "asdsadsa",
    thumbnail: "/1.jpg",
  },
  11: {
    title: "adasdas",
    author: "AAA",
    content: "asdsadsa",
    thumbnail: "/1.jpg",
  },
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
      videoId: "",
    },
  },
  {
    id: 1,
    username: "123",
    password: "$2b$10$J251lEpX3LI8UpxxIuXMiugtELV71EL4gO2bfHyMtUtPI2B4taNJu",
    email: "123@gmail.com",
    streamKey: "U2FsdGVkX18bAolx32khI/UvP46nraEwZDxwUIx1Xhc=",
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

usersTable.generateNewUser = async function (username, password, email) {
  const streamKeyHex = CryptoJS.AES.encrypt(username, SECRET_KEY).toString();
  const salt = bcrypt.genSaltSync(saltRounds);
  const passwordHash = bcrypt.hashSync(password, salt);
  const newUser = {
    id: this.length,
    username,
    password: passwordHash,
    email,
    streamKey: streamKeyHex,
    videos: {
      length: 0,
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
  };

  this.push(newUser);

  return {
    username,
    email,
  };
};

usersTable.verifyUser = function (username, password) {
  const user = this.find((user) => {
    if (user.username === username) {
      const result = bcrypt.compareSync(password, user.password);
      return result;
    }
  });

  if (!user) return null;

  return {
    username: user.username,
    email: user.email,
  };
};

class Video {
  constructor(videos) {
    if (videos) {
      const videosClone = _.cloneDeep(videos);
      Object.entries(videosClone).forEach(([key, value]) => {
        this[key] = value;
      });
      Object.defineProperty(this, "length", {
        value: Object.keys(videosClone).length,
        writable: true,
        enumerable: false,
        configurable: false,
      });
    } else {
      Object.defineProperty(this, "length", {
        value: 0,
        writable: true,
        enumerable: false,
        configurable: false,
      });
    }
  }

  createInitVideo() {
    const id = this.length;
    this.length++;

    return id;
  }

  update(id, video) {
    this[id] = video;

    return id;
  }
}

class Comments {
  constructor() {
    this.length = 0;
    this.createTime = Date.now();
  }
  addComment(user, text) {
    if (!user || !text) return;
    const comment = {
      user,
      message: {
        text,
        date: new Date().getTime(),
      },
    };
    this[this.length] = comment;
    this.length++;

    return comment;
  }
  searchComments() {
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
    if (!room || !message || !user) return;
    const comment = this[room].comments.addComment(message, user);
    return comment;
  }
  searchRoomComments(room) {
    return this[room].comments.searchComments();
  }
}

const videos = new Video(siteVideos);
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
    return res.status(500).send("stream key was wrong");
  }
  // 確認是否有該 user
  const user = usersTable.find((user) => user.username === username);

  if (!user) {
    console.log("無此 user");
    return res.status(500).send("stream key was wrong");
  }

  console.log("驗證成功！");

  // 取得新的 videoId
  const videoId = videos.createInitVideo();

  // 利用新的 streamKey(videoId) 推到 nginx，同時需要推送 username，nginx 會自動將 params(username) 當成 post data 傳至 on_publish 及 on_publish_done
  res
    .status(301)
    .redirect(
      `${process.env.VITE_STREAM_SERVER_URL}/hls_live/${videoId}?username=${username}`
    );
});

app.post("/rtmp/on_publish", (req, res) => {
  console.log("直播開始 'on_publish");
  const { username, name: videoId } = req.body;

  const user = usersTable.find((user) => user.username === username);

  // 直播狀態改為 on，用於使用者進入直播間時可自動去抓取直播資源，videoId 用來取得影片位置
  user.stream.isStreamOn = true;
  user.stream.videoId = videoId;

  // 傳送直播開始訊息，用於刷新影片
  io.to(username).emit("stream-connected", { videoId });

  res.status(204).end();
});

app.post("/rtmp/on_publish_done", async (req, res) => {
  console.log("直播結束 'on_publish_done'");
  const { name: videoId, username } = req.body;

  // 取得此 streamKey 的擁有者
  const user = usersTable.find((user) => user.username === username);
  // room 名稱與 username 相同，取得此 room 的 comments
  const { comments } = rooms[username];

  // 將此直播紀錄(影片、聊天室)儲存在 siteVideos 內
  videos.update(videoId, {
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
  user.stream.videoId = "";

  res.status(204).end();
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

app.post("/sign-up", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      throw new Error("Empty value");
    }

    // check username or email weren't duplicate
    const isDuplicate = usersTable.some(
      (user) => user.username === username || user.email === email
    );

    if (isDuplicate) {
      throw new Error("Duplicate account or email");
    }

    const user = await usersTable.generateNewUser(username, password, email);

    console.log(user);

    res.status(200).json({
      message: "Register success",
      user,
    });
  } catch (error) {
    const { message } = error;
    res.status(400).json({
      message,
    });
  }
});

app.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new Error("Empty value");
    }

    const user = usersTable.verifyUser(username, password);

    if (!user) {
      throw new Error("Verify wrong");
    }

    res.status(200).json({
      message: "Login success",
      user,
    });
  } catch (error) {
    const { message } = error;
    res.status(400).json({
      message,
    });
  }
});

// curl -d '{"username":"user01", "key2":"value2"}' -H "Content-Type: application/json" -X POST http://localhost:3535/get-stream

app.post("/get-stream", (req, res) => {
  const { username } = req.body;
  if (!username) return;

  const user = usersTable.find((user) => user.username === username);
  res.json(user.stream);
});

app.post("/get-streams", (req, res) => {
  const liveStreams = usersTable.find((user) => user.stream.isStreamOn) || [];

  res.json({ message: "success", liveStreams });
});

app.post("/videos", (req, res) => {
  const { page, limit } = req.body;

  const start = (page - 1) * limit;
  const end = page * limit;

  const sliceVideos = Object.entries(videos)
    .slice(start, end)
    .map((entry) => ({
      id: entry[0],
      ...entry[1],
    }));

  res.json({
    message: "success",
    videos: sliceVideos,
  });
});

app.post("/videos/:videoId", (req, res) => {
  console.log(req.body);
  console.log(req.params);
  res.json({ message: "success" });
});

io.on("connection", (socket) => {
  rooms.addRoom("user01");

  socket.on("new-user", (user, roomName) => {
    socket.join(roomName);

    rooms.addUserToRoom(roomName, socket.id, user);

    users.addUser(socket.id, user);
  });

  socket.on("send-message", (message, callback) => {
    const { user } = users[socket.id];
    currentRoomToDo((room) => {
      const comment = rooms.addCommentToRoom(room, user, message);
      io.in(room).emit("chat-message", comment);
      // console.log(rooms.searchRoomComments(room));
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
