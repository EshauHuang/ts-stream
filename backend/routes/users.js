import express from "express";
import { sessionAuth } from "../utils/sessionAuth.js";
import { usersTable } from "../models/stream.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log(`${req.method} /users${req.url}`);
  next();
});

export default router
  .get("/me", sessionAuth, (req, res) => {
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
      const { message } = error;
      console.log("error", message);

      res.status(400).json({
        message,
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
      const { message } = error;
      console.log("error", message);

      res.status(400).json({ message });
    }
  })
  .put("/:username", sessionAuth, (req, res) => {
    try {
      const { username } = req.params;
      const { title, content } = req.body;

      if (!username || !title) {
        throw new Error("Empty data!");
      }

      const options = usersTable.editUserMeta(username, {
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
      const { message } = error;
      console.log("error", message);

      res.status(400).json({ message });
    }
  })
  .put("/:username/subscribe/add", sessionAuth, (req, res) => {
    try {
      const { username } = req.params;
      const { user } = req.body;

      const subscribeList = usersTable.addSubscribeToList(user, username);

      res.json({ message: "success", subscribeList });
    } catch (error) {
      const { message } = error;

      res.status(400).json({ message });
    }
  })
  .put("/:username/subscribe/remove", sessionAuth, (req, res) => {
    try {
      const { username } = req.params;
      const { user } = req.body;

      const subscribeList = usersTable.removeSubscribeFromList(user, username);

      res.json({ message: "success", subscribeList });
    } catch (error) {
      const { message } = error;
      res.json({ message });
    }
  });
