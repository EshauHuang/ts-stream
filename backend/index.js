import "dotenv/config";
import cors from "cors";
import express from "express";
import session from "express-session";
import { createServer } from "http";
import { Server } from "socket.io";

import { startIo } from "./socket/chatroom.js";
import usersRoute from "./routes/users.js";
import streamsRoute from "./routes/streams.js";
import videosRoute from "./routes/videos.js";
import signRoute from "./routes/sign.js";
import liveRoute from "./routes/live.js";

const PORT = 3535;
const app = express();
const apiRouter = express.Router();

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
    preflightContinue: true,
    origin: process.env.SERVER_DOMAIN,
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

apiRouter.use("/", signRoute);
apiRouter.use("/users", usersRoute);
apiRouter.use("/streams", streamsRoute);
apiRouter.use("/videos", videosRoute);

app.use("/live", liveRoute);
app.use("/api", apiRouter);

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
