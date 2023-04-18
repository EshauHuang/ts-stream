import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import { createServer } from "http";
import { Server } from "socket.io";
import { copyFile } from "node:fs/promises";

import { usersTable, rooms, videos } from "./models/stream.js";
import { startIo } from "./socket/chatroom.js";
import { checkStreamKey } from "./utils/streamKey.js";
import generateDirectory from "./utils/generateDirectory.js";
import { toAbsolute } from "./utils/toAbsolute.js";
import checkDirectory from "./utils/checkDirectory.js";
import usersRoute from "./routes/users.js";
import streamsRoute from "./routes/streams.js";
import videosRoute from "./routes/videos.js";
import signRoute from "./routes/sign.js";
import liveRoute from "./routes/live.js"

dotenv.config();

const PORT = 3535;
const app = express();

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
    preflightContinue: true,
    origin: "http://localhost:3000",
    cookie: { maxAge: 600 * 1000 }, //10分鐘到期
  })
);

app.use(
  session({
    secret: "mySecret",
    name: "user", // optional
    saveUninitialized: false,
    resave: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

startIo(io);

// app.post("/auth/on_publish", (req, res) => {
//   try {
//     console.log("驗證 stream key '/auth/on_publish");
//     const { name: streamKey } = req.body;

//     // 判斷 streamKey 是否為此網站產生的，收到的 stream key 為 16 進位字串，需要解碼後再解析
//     const username = checkStreamKey(streamKey);

//     // 非網站產生 stream key(secret key 不同)
//     if (!username) {
//       return res.status(400).send("stream key was wrong");
//     }

//     // 確認是否有該 user
//     const user = usersTable.find((user) => user.username === username);

//     if (!user) {
//       console.log("無此 user");
//       return res.status(400).send("stream key was wrong");
//     }

//     console.log("驗證成功！");

//     // 取得新的 videoId
//     const videoId = videos.newVideoId();

//     // 利用新的 streamKey(videoId) 推到 nginx，同時需要推送 username，nginx 會自動將 params(username) 當成 post data 傳至 on_publish 及 on_publish_done
//     res
//       .status(301)
//       .redirect(
//         `${process.env.STREAM_SERVER_URL}/hls_live/${videoId}?username=${username}`
//       );
//   } catch (error) {
//     const { message } = error;
//     console.log("error", message);

//     res.status(400).json({
//       message,
//     });
//   }
// });

// app.post("/rtmp/on_publish", (req, res) => {
//   try {
//     console.log("直播開始 'on_publish");
//     const { username, name: videoId } = req.body;

//     const user = usersTable.find((user) => user.username === username);

//     // 直播狀態改為 on，用於使用者進入直播間時可自動去抓取直播資源，videoId 用來取得影片位置
//     user.stream.startTime = Date.now();
//     user.stream.isStreamOn = true;
//     user.stream.videoId = videoId;

//     // 傳送直播開始訊息，用於刷新影片
//     io.to(username).emit("stream-connected", { videoId });

//     res.status(204).end();
//   } catch (error) {
//     const { message } = error;
//     console.log("error", message);

//     res.status(400).json({
//       message,
//     });
//   }
// });

// app.post("/rtmp/on_publish_done", async (req, res) => {
//   try {
//     console.log("直播結束 'on_publish_done'");
//     const { name: videoId, username } = req.body;

//     // 取得此 streamKey 的擁有者
//     const user = usersTable.find((user) => user.username === username);

//     // room 名稱與 username 相同，取得此 room 的 comments
//     const { comments } = rooms[username];

//     const { isStreamOn, thumbnail, ...streamData } = user.stream;
//     const streamThumbnailDirectory = toAbsolute(`publish/users/${username}`);
//     const videoThumbnailDirectory = toAbsolute(`publish/videos/${videoId}`);
//     const thumbnailFileName = "thumbnail.jpg";
//     const streamThumbnailPath = `${streamThumbnailDirectory}/${thumbnailFileName}`;
//     const videoThumbnailPath = `${videoThumbnailDirectory}/${thumbnailFileName}`;

//     const isFileExist =
//       !!thumbnail && (await checkDirectory(streamThumbnailPath));

//     if (isFileExist) {
//       await generateDirectory(videoThumbnailDirectory);
//       await copyFile(streamThumbnailPath, videoThumbnailPath);
//     }

//     // 將此直播紀錄(影片、聊天室)儲存在 siteVideos 內
//     videos.createVideo(videoId, {
//       ...streamData,
//       thumbnail: `/videos/${videoId}/thumbnail`,
//       comments,
//       type: "video",
//     });

//     // 將影片加至 user 的 videos 內
//     user.videos.addVideo({
//       ...streamData,
//       thumbnail: `/videos/${videoId}/thumbnail`,
//       comments,
//       type: "video",
//     });

//     usersTable.initialRoom(username);

//     rooms.initialRoom(username);
//     res.status(204).end();
//   } catch (error) {
//     const { message } = error;
//     console.log("error", message);

//     res.status(400).json({
//       message,
//     });
//   }
// });

app.use("/", signRoute);

app.use("/users", usersRoute);

app.use("/streams", streamsRoute);

app.use("/videos", videosRoute);

app.use("/live", liveRoute);

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
