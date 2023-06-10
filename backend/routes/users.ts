import express from "express";
import { sessionAuth } from "../utils/sessionAuth.js";
import { usersTable } from "../models/stream.js";
import { toAbsolute } from "../utils/toAbsolute.js";
import { access, constants } from "node:fs/promises";
import { CustomRequest } from "../index"

const router = express.Router();

router.use((req, res, next) => {
  console.log(`${req.method} /users${req.url}`);
  next();
});

export default router
  .get("/me", sessionAuth, (req: CustomRequest, res) => {
    try {
      const { user } = req.session;

      if (!user) {
        return res.status(200).json({ message: "Not sign in" });
      }

      const data = usersTable.getMe(user);

      res.status(200).json({
        message: "success",
        data,
      });
    } catch (error) {
      if (error instanceof Error) {
        const { message } = error;
        console.log("error", message);

        res.status(400).json({
          message,
        });
      }

      res.status(400).json({
        message: "Unexpected error",
      });
    }
  })
  .get("/:username", (req, res) => {
    try {
      const { username } = req.params;
      if (!username) return;
      const data = usersTable.getUser(username);

      res.json({ message: "success", data });
    } catch (error) {
      if (error instanceof Error) {
        const { message } = error;
        console.log("error", message);

        res.status(400).json({
          message,
        });
      }

      res.status(400).json({
        message: "Unexpected error",
      });
    }
  })
  .put("/:username", sessionAuth, (req, res) => {
    try {
      const { username } = req.params;
      const { title, content }: { title: string, content: string } = req.body;

      if (!username || !title) {
        throw new Error("Empty data!");
      }
      const options = usersTable.editMemberInfo(username, {
        stream: {
          title,
          content,
        },
      });

      res.json({
        message: "success",
        data: options,
      });
    } catch (error) {
      if (error instanceof Error) {
        const { message } = error;
        console.log("error", message);

        res.status(400).json({
          message,
        });
      }

      res.status(400).json({
        message: "Unexpected error",
      });
    }
  })
  .put("/:username/subscribe/add", sessionAuth, (req, res) => {
    try {
      const { username } = req.params;
      const { user } = req.body;

      const subscribeList = usersTable.addSubscribeToList(user, username);

      res.json({ message: "success", subscribeList });
    } catch (error) {
      if (error instanceof Error) {
        const { message } = error;
        console.log("error", message);

        res.status(400).json({
          message,
        });
      }

      res.status(400).json({
        message: "Unexpected error",
      });
    }
  })
  .put("/:username/subscribe/remove", sessionAuth, (req, res) => {
    try {
      const { username } = req.params;
      const { user } = req.body;

      const subscribeList = usersTable.removeSubscribeFromList(user, username);

      res.json({ message: "success", subscribeList });
    } catch (error) {
      if (error instanceof Error) {
        const { message } = error;
        console.log("error", message);

        res.status(400).json({
          message,
        });
      }

      res.status(400).json({
        message: "Unexpected error",
      });
    }
  })
  .get("/:username/avatar", async (req, res) => {
    try {
      const { username } = req.params;

      if (!username) {
        throw new Error("Invalid data!");
      };

      const directory = toAbsolute(`publish/users/${username}/avatar.jpg`);
      await access(directory, constants.F_OK);

      res.sendFile(directory);
    } catch (error) {
      if (error instanceof Error) {
        const { message } = error;
        console.log("error", message);

        res.status(400).json({
          message,
        });
      }

      res.status(400).json({ message: "no such file or directory" });
    }
  });
