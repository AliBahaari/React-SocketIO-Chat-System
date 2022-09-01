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

  const sendMessage = () => {
    setMessages((prevState) => [...prevState, message]);

    socket.emit("send_message", {
      message,
      roomNumbers: selectedRoom,
    });
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

      <div className="messageBox">
        <input
          type="text"
          placeholder="Message..."
          onChange={(event) => setMessage(event.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
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
