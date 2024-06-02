const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors()); // Enable CORS

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow your React app to access this server
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 4000;

let orderBook = {
  buys: Array.from({ length: 5 }, () => ({
    price: (Math.random() * 10000).toFixed(2),
    amount: (Math.random() * 10).toFixed(2),
  })),
  sells: Array.from({ length: 5 }, () => ({
    price: (Math.random() * 10000).toFixed(2),
    amount: (Math.random() * 10).toFixed(2),
  })),
};

const updateOrderBook = () => {
  const updateOrder = (order) => {
    order.price = (
      parseFloat(order.price) +
      (Math.random() - 0.5) * 100
    ).toFixed(2);
    order.amount = (parseFloat(order.amount) + (Math.random() - 0.5)).toFixed(
      2
    );
    if (order.amount <= 0) order.amount = (Math.random() * 10).toFixed(2);
  };

  orderBook.buys.forEach(updateOrder);
  orderBook.sells.forEach(updateOrder);
};

io.on("connection", (socket) => {
  console.log("New client connected");

  const sendOrderBook = () => {
    updateOrderBook();
    socket.emit("orderBook", orderBook);
  };

  const interval = setInterval(sendOrderBook, 1000);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
