import http from "http";
import express from "express";
import cors from "cors";

import { Server } from "colyseus";
import { MyRoom } from "./MyRoom";

import socialRoutes from "@colyseus/social/express";

const PORT = Number(process.env.PORT || 8000);

const app = express();

const gameServer = new Server({
  server: http.createServer(app),
  pingInterval: 0,
});

gameServer.define("demo", MyRoom);

app.use("/", socialRoutes);

app.get("/something", function (req, res) {
  console.log("something!", process.pid);
  res.send("Hey!");
});

// Listen on specified PORT number
gameServer.listen(PORT);

console.log("Running on ws://localhost:" + PORT);