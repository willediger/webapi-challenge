const express = require("express");

const projectRouter = require("./routers/projectRouter.js");
const actionRouter = require("./routers/actionRouter.js");

const server = express();

server.use(express.json());
server.use(logger);

server.use("/api/projects", projectRouter);
// server.use("/api/actions", actionRouter);

const greeting = process.env.GREETING;

server.get("/", (req, res) => {
  res.send(`<p>${greeting}</p>`);
});

server.use(errHandler);

function errHandler(err, req, res, next) {
  res.status(err.status).json({ message: err.message });
}

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
  next();
}

module.exports = server;
