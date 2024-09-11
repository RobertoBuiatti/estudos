import io from "socket.io-client";

const PORT = 3001;
const socket = io(`http://localhost:${PORT}`);

export default socket;
