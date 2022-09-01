const app = require("express")();
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const io = new Server(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

http.listen(3001, () => console.log("Server is running..."));

app.get("/", (req, res) => {
  res.send("Socket.io");
});

io.on("connection", (socket) => {
  socket.emit("socket_id", socket.id);
  socket.broadcast.emit("joined_user", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
  });

  socket.on("send_message", (data) => {
    socket.to(data.roomNumbers).emit("reply_message", data);
  });
});
