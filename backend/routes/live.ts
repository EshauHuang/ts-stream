import express from "express";
import { copyFile } from "node:fs/promises";
import path from "path";

import { io } from "../index";
import { usersTable } from "../models/stream.js";
import { toAbsolute } from "../utils/toAbsolute.js";
import { videos, rooms } from "../models/stream.js";
import { checkStreamKey } from "../utils/streamKey.js";
import checkDirectory from "../utils/checkDirectory.js";
import generateDirectory from "../utils/generateDirectory.js";
import watchMediaDirectory from "../utils/watchMediaDirectory.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log(`${req.method} /live${req.url}`);
  next();
});

export default router
  .post("/auth", (req, res) => {
    try {
      console.log("驗證 stream key");
      const { name: streamKey } = req.body;

      // 判斷 streamKey 是否為此網站產生的，收到的 stream key 為 16 進位字串，需要解碼後再解析
      const username = checkStreamKey(streamKey);

      // 非網站產生 stream key(secret key 不同)
      if (!username) {
        return res.status(400).send("stream key was wrong");
      }

      // 確認是否有該 user
      const user = usersTable.findUser(username);

      if (!user) {
        console.log("無此 user");
        return res.status(400).send("stream key was wrong");
      }

      console.log("驗證成功！");

      // 取得新的 videoId
      const videoId = videos.newVideoId();

      // 利用新的 streamKey(videoId) 推到 nginx，同時需要推送 username，nginx 會自動將 params(username) 當成 post data 傳至 on_publish 及 on_publish_done
      res
        .status(302)
        .redirect(`${process.env.STREAM_SERVER_URL}/stream/${videoId}?username=${username}`);
    } catch (error: any) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({
        message,
      });
    }
  })
  .post("/start", (req, res) => {
    try {
      console.log("Live stream started");
      const { username, name: videoId } = req.body;
      
      if (!username || !videoId) {
        throw new Error(
          "Missing or invalid 'username' or 'name' properties in request body"
        );
      }

      const user = usersTable.findUser(username);

      if (!user) throw new Error("Can't find the user!")

      const mediaDir = path.join(`/app/media/${videoId}.m3u8`);

      watchMediaDirectory(mediaDir, () => {
        console.log("onM3U8Added");

        // 直播狀態改為 on，用於使用者進入直播間時可自動去抓取直播資源，videoId 用來取得影片位置
        user.stream.startTime = Date.now();
        user.stream.isStreamOn = true;
        user.stream.videoId = videoId;

        // 傳送直播開始訊息，用於刷新影片
        io.to(username).emit("stream-connected", { videoId });
      });

      res.status(204).end();
    } catch (error: any) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({
        message,
      });
    }
  })
  .post("/end", async (req, res) => {
    try {
      console.log("直播結束");
      const { name: videoId, username } = req.body;

      // 取得此 streamKey 的擁有者
      const user = usersTable.findUser(username);

      if (!user) throw new Error("Can't find the user!")

      // room 名稱與 username 相同，取得此 room 的 comments
      const { comments } = rooms.rooms[username];

      const { isStreamOn, thumbnail, ...streamData } = user.stream;
      const streamThumbnailDirectory = toAbsolute(`publish/users/${username}`);
      const videoThumbnailDirectory = toAbsolute(`publish/videos/${videoId}`);
      const thumbnailFileName = "thumbnail.jpg";
      const streamThumbnailPath = `${streamThumbnailDirectory}/${thumbnailFileName}`;
      const videoThumbnailPath = `${videoThumbnailDirectory}/${thumbnailFileName}`;

      const isFileExist =
        !!thumbnail && (await checkDirectory(streamThumbnailPath));

      if (isFileExist) {
        await generateDirectory(videoThumbnailDirectory);
        await copyFile(streamThumbnailPath, videoThumbnailPath);
      }

      // 將此直播紀錄(影片、聊天室)儲存在 siteVideos 內
      videos.createVideo(videoId, {
        ...streamData,
        thumbnail: `/videos/${videoId}/thumbnail`,
        comments,
        type: "video",
      });

      // 將影片加至 user 的 videos 內
      user.videos.createVideo(videoId, {
        ...streamData,
        thumbnail: `/videos/${videoId}/thumbnail`,
        comments,
        type: "video",
      });

      usersTable.initialRoom(username);
      rooms.initialRoom(username);

      res.status(204).end();
    } catch (error: any) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({
        message,
      });
    }
  });
