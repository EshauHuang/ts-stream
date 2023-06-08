import express from "express";
import { usersTable } from "../models/stream";
import { rooms } from "../models/stream";
import { CustomRequest  } from "../index"


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
    } catch (error: any) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({
        message,
      });
    }
  })
  .post("/sign-up", async (req: CustomRequest, res) => {
    try {
      const { username, password, email } = req.body;

      if (!username || !password || !email) {
        throw new Error("Empty value");
      }

      // check username or email weren't duplicate
      const isDuplicate = usersTable.some(
        (user: any) => user.username === username || user.email === email
      );

      if (isDuplicate) {
        throw new Error("Duplicate account or email");
      }

      const data = await usersTable.generateNewUser(username, password, email);

      if (!data) {
        throw new Error("Something went wrong");
      }

      rooms.addRoom(data.user.username);

      req.session.user = data.user.username;

      res.status(200).json({
        message: "Register success",
        data,
      });
    } catch (error: any) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({
        message,
      });
    }
  })
  .post("/sign-in", async (req: CustomRequest, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        throw new Error("Empty value");
      }

      const data = usersTable.verifyUser(username, password);

      if (!data) {
        throw new Error("Verify wrong");
      }

      req.session.user = data.user.username;

      res.status(200).json({
        message: "Login success",
        data,
      });
    } catch (error: any) {
      const { message } = error;
      console.log("error", message);

      res.status(400).json({
        message,
      });
    }
  });
