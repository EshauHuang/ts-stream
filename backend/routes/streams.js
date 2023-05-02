import express from "express";
import { access, constants } from "node:fs/promises";
import { sessionAuth } from "../utils/sessionAuth.js";
import { usersTable } from "../models/stream.js";
import { upload } from "../utils/multerStorage.js";
import { toAbsolute } from "../utils/toAbsolute.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log(`${req.method} /streams${req.url}`);
  next();
});

export default router
  .post("/", (req, res) => {
    try {
      const { page, limit } = req.body;

      const start = (page - 1) * limit;
      const end = page * limit;

      const streams = usersTable
        .filter((user) => user.stream.isStreamOn)
        .slice(start, end)
        .map((user) => user.stream);

      res.json({ message: "success", streams });
    } catch (error) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({ message });
    }
  })
  .get("/:username", (req, res) => {
    try {
      const { username } = req.params;
      if (!username) return;

      const streamMeta = usersTable.getStream(username);

      res.json({
        message: "success",
        data: {
          ...streamMeta,
        },
      });
    } catch (error) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({ message });
    }
  })
  .get("/:username/thumbnail", async (req, res) => {
    try {
      const { username } = req.params;

      if (!username) return;

      const directory = toAbsolute(`publish/users/${username}/thumbnail.jpg`);

      await access(directory, constants.F_OK);

      res.sendFile(directory);
    } catch (error) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({ message: "no such file or directory" });
    }
  })
  .post(
    "/:username/thumbnail",
    sessionAuth,
    upload.single("thumbnail"),
    async (req, res) => {
      try {
        const { username } = req.params;
        const { file } = req;

        if (!username || !file) return;

        const thumbnail = usersTable.editStreamThumbnail(username);

        res.json({
          message: "success",
          data: { stream: { thumbnail } },
        });
      } catch (error) {
        const { message } = error;
        console.log("error", message);

        res.status(400).json({ message });
      }
    }
  )
  .post("/:username/streamKey", sessionAuth, (req, res) => {
    try {
      const { username } = req.params;

      if (!username) {
        throw new Error("Empty value!");
      }

      const streamKey = usersTable.refreshStreamKey(username);

      res.json({ message: "success", streamKey });
    } catch (error) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({ message });
    }
  })
  .put("/:username/like/add", sessionAuth, (req, res) => {
    try {
      const { username } = req.params;
      const { user } = req.body;

      // 找直播中的 videoId
      const { stream } = usersTable.getStream(username);
      const { videoId } = stream;

      // 如還未將影片加至 user 喜愛影片內則加入，有加入則刪除
      const likeVideoList = usersTable.addLikeVideoToList(user, videoId);

      if (!likeVideoList) throw new Error("Video can't add to like list.");
      const like = usersTable.addLike(username);

      res.json({ message: "success", like, likeVideoList });
    } catch (error) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({ message });
    }
  })
  .put("/:username/like/reduce", sessionAuth, (req, res) => {
    try {
      const { username } = req.params;
      const { user } = req.body;

      // 找直播中的 videoId
      const { stream } = usersTable.getStream(username);
      const { videoId } = stream;

      // 如還未將影片加至 user 喜愛影片內則加入，有加入則刪除
      const likeVideoList = usersTable.removeLikeVideoFromList(user, videoId);

      if (!likeVideoList) throw new Error("Video can't remove from like list.");
      const like = usersTable.reduceLike(username);

      res.json({ message: "success", like, likeVideoList });
    } catch (error) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({ message });
    }
  })
  .put("/:username/dislike/add", sessionAuth, (req, res) => {
    try {
      const { username } = req.params;
      const { user } = req.body;

      // 找直播中的 videoId
      const { stream } = usersTable.getStream(username);
      const { videoId } = stream;

      // 如還未將影片加至 user 喜愛影片內則加入，有加入則刪除
      const dislikeVideoList = usersTable.addDislikeVideoToList(user, videoId);

      if (!dislikeVideoList)
        throw new Error("Video can't add to dislike list.");
      const dislike = usersTable.addDislike(username);

      res.json({ message: "success", dislike, dislikeVideoList });
    } catch (error) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({ message });
    }
  })
  .put("/:username/dislike/reduce", sessionAuth, (req, res) => {
    try {
      const { username } = req.params;
      const { user } = req.body;

      // 找直播中的 videoId
      const { stream } = usersTable.getStream(username);
      const { videoId } = stream;

      // 如還未將影片加至 user 喜愛影片內則加入，有加入則刪除
      const dislikeVideoList = usersTable.removeDislikeVideoFromList(
        user,
        videoId
      );

      if (!dislikeVideoList)
        throw new Error("Video can't remove from dislike list.");
      const dislike = usersTable.reduceDislike(username);

      res.json({ message: "success", dislike, dislikeVideoList });
    } catch (error) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({ message });
    }
  })
