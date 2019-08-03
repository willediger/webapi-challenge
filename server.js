const express = require("express");

const server = express();

server.use(express.json());
server.use(logger);

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
