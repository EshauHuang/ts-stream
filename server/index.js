import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import CryptoJS from "crypto-js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import { Video, Rooms, Users, Comments } from "./models/index.js";

const SECRET_KEY = "testtest";
const saltRounds = 10;
const PORT = 3535;

// 網站總共有多少部影片
const siteVideos = {
  1: {
    title: "how programmers overprepare for job interviews",
    author: "Joma Tech",
    content: "asdsadsa",
    thumbnail: "/2.jpg",
    startTime: 1675759497647,
    comments: new Comments(),
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

// 假資料
const video = siteVideos[1];
const comments = [
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "asd", date: 1675759497647 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "asd", date: 1675759497786 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "asdas", date: 1675759498151 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "d", date: 1675759498217 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "a", date: 1675759498330 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "da", date: 1675759498456 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "sd", date: 1675759498557 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "a", date: 1675759498662 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "d", date: 1675759498790 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "a", date: 1675759498916 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "d", date: 1675759499006 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "a", date: 1675759499106 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "d", date: 1675759499211 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "csfsdf", date: 1675759501410 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "s", date: 1675759501574 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "sdf", date: 1675759501999 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "sd", date: 1675759502141 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "fs", date: 1675759502269 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "f", date: 1675759502416 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "sf", date: 1675759502557 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "s", date: 1675759502708 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "fs", date: 1675759502866 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "df", date: 1675759503008 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "sf", date: 1675759503191 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "s", date: 1675759503341 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "fs", date: 1675759503472 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "f", date: 1675759503624 },
    },
  },
  {
    comment: {
      user: { username: "Sans" },
      message: { text: "s", date: 1675759503756 },
    },
  },
];
comments.map((comment) => {
  const c = comment.comment;
  video.comments.addFakeComment(c.user, c.message);
});

// 儲存每個用戶的資訊
const usersTable = [
  {
    id: 1,
    username: "user01",
    streamKey: "U2FsdGVkX1/5NVvBrPwm01j8Ww0RFc8t/Nkyty1L85g=",
    videos: {
      1: {
        // 關聯到 siteVideosID
      },
      length: 1,
      addVideo(video) {
        const index = this.length + 1;
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
      startTime: "",
    },
  },
  {
    id: 2,
    username: "123",
    password: "$2b$10$J251lEpX3LI8UpxxIuXMiugtELV71EL4gO2bfHyMtUtPI2B4taNJu",
    email: "123@gmail.com",
    streamKey: "U2FsdGVkX18bAolx32khI/UvP46nraEwZDxwUIx1Xhc=",
    videos: {
      1: {
        // 關聯到 siteVideosID
      },
      length: 1,
      addVideo(video) {
        const index = this.length + 1;
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
      startTime: "",
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
        const index = this.length + 1;
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

export const videos = new Video(siteVideos);
export const rooms = new Rooms();
export const users = new Users();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = createServer(app);

export const io = new Server(server, {
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
  const videoId = videos.newVideoId();

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
  user.stream.startTime = Date.now();
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
  const { title, content, startTime } = user.stream;

  // 將此直播紀錄(影片、聊天室)儲存在 siteVideos 內
  videos.createVideo(videoId, {
    title,
    content,
    startTime,
    comments,
  });

  // 將影片加至 user 的 videos 內
  user.videos.addVideo({
    videoId,
    title,
    content,
    startTime,
    comments,
  });

  user.stream.isStreamOn = false;
  user.stream.videoId = "";

  res.status(204).end();
});

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

app.post("/streams", (req, res) => {
  const liveStreams = usersTable.find((user) => user.stream.isStreamOn) || [];

  res.json({ message: "success", liveStreams });
});

app.post("/streams/:username", (req, res) => {
  const { username } = req.params;
  if (!username) return;

  const user = usersTable.find((user) => user.username === username);
  res.json(user.stream);
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
  try {
    const { videoId } = req.params;

    const video = videos.getVideo(videoId);

    res.json({ message: "success", video });
  } catch (error) {
    const { message } = error;
    res.status(400).json({
      message,
    });
  }
});

app.post("/comments/:videoId", (req, res) => {
  try {
    const { videoId } = req.params;
    const { date } = req.query;

    const sliceComments = videos.getSliceComments(videoId, date);

    res.json({ message: "success", comments: sliceComments });
  } catch (error) {
    console.log(error);
    const { message } = error;
    res.status(400).json({
      message,
    });
  }
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
