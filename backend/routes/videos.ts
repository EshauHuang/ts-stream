import express from "express";
import { access, constants } from "node:fs/promises";
import { sessionAuth } from "../utils/sessionAuth";
import { usersTable } from "../models/stream";
import { toAbsolute } from "../utils/toAbsolute";
import { videos } from "../models/stream";

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
    } catch (error) {
      if (error instanceof Error) {
        const { message } = error;
        console.log("error", message);

        res.status(400).json({
          message,
        });
      } else {
        res.status(400).json({
          message: "Unexpected error",
        });
      }
    }
  })
  .get("/:videoId", (req, res) => {
    try {
      const { videoId } = req.params;
      const videoData = videos.getVideo(videoId);

      res.json({ message: "success", data: { ...videoData } });
    } catch (error) {
      if (error instanceof Error) {
        const { message } = error;
        console.log("error", message);

        res.status(400).json({
          message,
        });
      } else {
        res.status(400).json({
          message: "Unexpected error",
        });
      }
    }
  })
  .get("/:videoId/thumbnail", async (req, res) => {
    try {
      const { videoId } = req.params;

      if (!videoId) return;

      const directory = toAbsolute(`publish/videos/${videoId}/thumbnail.jpg`);
      await access(directory, constants.F_OK);

      res.sendFile(directory);
    } catch (error) {
      if (error instanceof Error) {
        const { message } = error;
        console.log("error", message);

        res.status(400).json({
          message,
        });
      } else {
        res.status(400).json({ message: "no such file or directory" });
      }
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
    } catch (error) {
      if (error instanceof Error) {
        const { message } = error;
        console.log("error", message);

        res.status(400).json({
          message,
        });
      } else {
        res.status(400).json({
          message: "Unexpected error",
        });
      }
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
    } catch (error) {
      if (error instanceof Error) {
        const { message } = error;
        console.log("error", message);

        res.status(400).json({
          message,
        });
      } else {
        res.status(400).json({
          message: "Unexpected error",
        });
      }
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
    } catch (error) {
      if (error instanceof Error) {
        const { message } = error;
        console.log("error", message);

        res.status(400).json({
          message,
        });
      } else {
        res.status(400).json({
          message: "Unexpected error",
        });
      }
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
    } catch (error) {
      if (error instanceof Error) {
        const { message } = error;
        console.log("error", message);

        res.status(400).json({
          message,
        });
      } else {
        res.status(400).json({
          message: "Unexpected error",
        });
      }
    }
  });
