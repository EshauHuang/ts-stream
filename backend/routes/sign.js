import express from "express";
import { usersTable } from "../models/stream.js";
import { rooms } from "../models/stream.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

export default router
  .get("/sign-out", (req, res) => {
    try {
      req.session.destroy(function (err) {
        console.log("Destroyed session");
        console.log(err);
      });

      res.status(200).json({ message: "sign out" });
    } catch (error) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({
        message,
      });
    }
  })
  .post("/sign-up", async (req, res) => {
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
      rooms.addRoom(username);

      req.session.user = username;

      res.status(200).json({
        message: "Register success",
        user,
      });
    } catch (error) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({
        message,
      });
    }
  })
  .post("/sign-in", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        throw new Error("Empty value");
      }

      const user = usersTable.verifyUser(username, password);

      if (!user) {
        throw new Error("Verify wrong");
      }

      req.session.user = username;

      res.status(200).json({
        message: "Login success",
        user,
      });
    } catch (error) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({
        message,
      });
    }
  });
