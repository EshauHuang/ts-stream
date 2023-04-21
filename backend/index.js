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

app.use("/", signRoute);

app.use("/users", usersRoute);

app.use("/streams", streamsRoute);

app.use("/videos", videosRoute);

app.use("/live", liveRoute);

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
