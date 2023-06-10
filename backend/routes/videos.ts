import express from "express";
import { access, constants } from "node:fs/promises";
import { sessionAuth } from "../utils/sessionAuth.js";
import { usersTable } from "../models/stream.js";
import { toAbsolute } from "../utils/toAbsolute.js";
import { videos } from "../models/stream.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log(`${req.method} /videos${req.url}`);
  next();
});

export default router
  .post("/", (req, res) => {
    try {
      const { page, limit } = req.body;

      const start = (page - 1) * limit;
      const end = page * limit;

      const sliceVideos = videos.getVideos(page, limit);

      res.json({
        message: "success",
        videos: sliceVideos,
      });
    } catch (error: any) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({ message });
    }
  })
  .get("/:videoId", (req, res) => {
    try {
      const { videoId } = req.params;
      const videoData = videos.getVideo(videoId);

      res.json({ message: "success", data: { ...videoData } });
    } catch (error: any) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({
        message,
      });
    }
  })
  .get("/:videoId/thumbnail", async (req, res) => {
    try {
      const { videoId } = req.params;

      if (!videoId) return;

      const directory = toAbsolute(`publish/videos/${videoId}/thumbnail.jpg`);
      await access(directory, constants.F_OK);

      res.sendFile(directory);
    } catch (error: any) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({ message: "no such file or directory" });
    }
  })
  .post("/:videoId/comments", (req, res) => {
    const { videoId } = req.params;
    const { time, mode } = req.body;

    const comments = videos.getVideoComments(videoId, time, mode);

    res.json({ message: "success", comments });
  })
  .put("/:videoId/like/add", sessionAuth, (req, res) => {
    try {
      const { videoId } = req.params;
      const { user } = req.body;

      // 如還未將影片加至 user 喜愛影片內則加入，有加入則刪除
      const likeVideoList = usersTable.addLikeVideoToList(user, videoId);

      if (!likeVideoList) throw new Error("Video can't add to like list.");
      const like = videos.addLike(videoId);

      res.json({ message: "success", like, likeVideoList });
    } catch (error: any) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({ message });
    }
  })
  .put("/:videoId/like/reduce", sessionAuth, (req, res) => {
    try {
      const { videoId } = req.params;
      const { user } = req.body;

      // 如還未將影片加至 user 喜愛影片內則加入，有加入則刪除
      const likeVideoList = usersTable.removeLikeVideoFromList(user, videoId);

      if (!likeVideoList) throw new Error("Video can't remove from like list.");
      const like = videos.reduceLike(videoId);

      res.json({ message: "success", like, likeVideoList });
    } catch (error: any) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({ message });
    }
  })
  .put("/:videoId/dislike/add", sessionAuth, (req, res) => {
    try {
      const { videoId } = req.params;
      const { user } = req.body;

      // 如還未將影片加至 user 喜愛影片內則加入，有加入則刪除
      const dislikeVideoList = usersTable.addDislikeVideoToList(user, videoId);

      if (!dislikeVideoList)
        throw new Error("Video can't add to dislike list.");
      const dislike = videos.addDislike(videoId);

      res.json({ message: "success", dislike, dislikeVideoList });
    } catch (error: any) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({ message });
    }
  })
  .put("/:videoId/dislike/reduce", sessionAuth, (req, res) => {
    try {
      const { videoId } = req.params;
      const { user } = req.body;

      // 如還未將影片加至 user 喜愛影片內則加入，有加入則刪除
      const dislikeVideoList = usersTable.removeDislikeVideoFromList(
        user,
        videoId
      );

      if (!dislikeVideoList)
        throw new Error("Video can't remove from dislike list.");
      const dislike = videos.reduceDislike(videoId);

      res.json({ message: "success", dislike, dislikeVideoList });
    } catch (error: any) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({ message });
    }
  });
