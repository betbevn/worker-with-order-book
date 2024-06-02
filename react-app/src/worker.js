// worker.js
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

socket.on("orderBook", (orderBook) => {
  postMessage(orderBook);
});

onmessage = (e) => {
  if (e.data === "start") {
    console.log("Worker started");
  }
};
