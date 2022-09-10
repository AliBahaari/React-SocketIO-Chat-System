import io from "socket.io-client";
import { useEffect, useState } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket = io.connect("http://localhost:3001");

function App() {
  const [message, setMessage] = useState("");
  const [id, setId] = useState("");
  const [rooms] = useState(["Foo", "Bar"]);
  const [selectedRoom, setSelectedRoom] = useState();
  const [messages, setMessages] = useState([]);
  const [privateRoom, setPrivateRoom] = useState("");
  const [isPriavteRoomJoined, setIsPriavteRoomJoined] = useState(false);

  const joinPrivateRoom = () => {
    socket.emit("join_private_room", privateRoom);
    setIsPriavteRoomJoined(true);
  };

  const sendMessage = () => {
    setMessages((prevState) => [...prevState, message]);
    if (!privateRoom) {
      socket.emit("send_message", {
        message,
        roomNumbers: selectedRoom,
      });
    } else {
      socket.emit("send_message", {
        message,
        roomNumbers: privateRoom,
      });
    }
  };

  const joinRoom = (room) => {
    setSelectedRoom(room);
    socket.emit("join_room", room);
  };

  useEffect(() => {
    socket.on("reply_message", ({ message }) => {
      setMessages((prevState) => [...prevState, message]);
    });
  }, []);

  useEffect(() => {
    socket.on("socket_id", (id) => {
      setId(id);
    });
  }, []);

  useEffect(() => {
    socket.on("joined_user", (joined_user) => {
      toast.info(`🕶 ${joined_user} joined us!`, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
    });
  }, []);

  useEffect(() => {
    socket.on("user_joined_room", (room) => {
      toast.info(`🕶 A user joined ${room}!`, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
    });
  }, []);

  const leavePrivateRoom = () => {
    socket.emit("leave_private_room", privateRoom);
    setPrivateRoom("");
    setIsPriavteRoomJoined(false);
  };

  return (
    <div>
      <ToastContainer bodyStyle={{ fontFamily: "Roboto Mono" }} />

      <p className="boldFontWeight">
        Your ID is: <small style={{ color: "Blue" }}>{id}</small>
      </p>

      <div>
        <p className="boldFontWeight">Rooms:</p>
        {rooms.map((room, index) => (
          <p
            style={{
              cursor: "pointer",
              borderBottom: "1px solid Gray",
            }}
            onClick={() => joinRoom(room)}
          >
            {room}
          </p>
        ))}
      </div>

      <div className="box">
        <input
          type="text"
          style={{
            backgroundColor: isPriavteRoomJoined ? "#EEE" : "Transparent",
          }}
          placeholder="Private Room..."
          disabled={isPriavteRoomJoined}
          onChange={(event) => setPrivateRoom(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && joinPrivateRoom()}
        />
        <button onClick={joinPrivateRoom}>Join Private Room</button>
        <button style={{ backgroundColor: "Red" }} onClick={leavePrivateRoom}>
          Leave
        </button>
      </div>

      <div className="box">
        <input
          type="text"
          placeholder="Message..."
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && sendMessage()}
        />
        <button onKeyDown={sendMessage} onClick={sendMessage}>
          Send
        </button>
      </div>

      <div>
        {messages.map((message, index) => (
          <p>{message}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
