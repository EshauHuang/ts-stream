import "dotenv/config";
import cors from "cors";
import express, { Request } from "express";
import session from "express-session";
import { createServer } from "http";
import { Server } from "socket.io";

import { startIo } from "./socket/chatroom";
import usersRoute from "./routes/users";
import streamsRoute from "./routes/streams";
import videosRoute from "./routes/videos";
import signRoute from "./routes/sign";
import liveRoute from "./routes/live";

import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData  } from "./socket/chatroom"

interface UserSession extends session.Session {
  user?: string;
}

export interface CustomRequest extends Request {
  session: UserSession;
}

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

export const io = new Server<ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData>(server, {
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
