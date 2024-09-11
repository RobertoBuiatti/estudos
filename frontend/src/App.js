import { useEffect, useState } from "react";
import io from "socket.io-client";

const PORT = 3001;
const socket = io(`http://localhost:${PORT}`);

function App() {
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [newMessage, setNewMessage] = useState("");
	const [user, setUser] = useState("");
	const [room, setRoom] = useState("");
	const [chatIsVisible, setChatIsVisible] = useState(false);
	const [messages, setMessages] = useState([]);

	// Configurações de conexão e desconexão com o servidor socket.io
	useEffect(() => {
		socket.on("connect", () => {
			setIsConnected(true);
			console.log("Connected:", socket.id);
		});

		socket.on("disconnect", () => {
			setIsConnected(false);
			console.log("Disconnected");
		});

		socket.on("receive_message", ({ user, message }) => {
			const msg = `${user} sent: ${message}`;
			setMessages((prevState) => [msg, ...prevState]);
		});

		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("receive_message");
		};
	}, []);

	// Entrar na sala de chat
	const handleEnterChatRoom = () => {
		if (user && room) {
			socket.emit("join_room", user, room);
			setChatIsVisible(true);
		}
	};

	// Enviar mensagem para a sala
	const handleSendMessage = () => {
		if (newMessage.trim()) {
			const messageData = { room, user, message: newMessage };
			socket.emit("send_message", room, user, newMessage);
			setMessages((prevState) => [
				`${user} sent: ${newMessage}`,
				...prevState,
			]);
			setNewMessage("");
		}
	};

	return (
		<div style={{ padding: 20 }}>
			{!chatIsVisible ? (
				<div>
					<input
						type="text"
						placeholder="User"
						value={user}
						onChange={(e) => setUser(e.target.value)}
						style={{ marginBottom: 10 }}
					/>
					<input
						type="text"
						placeholder="Room"
						value={room}
						onChange={(e) => setRoom(e.target.value)}
						style={{ marginBottom: 10 }}
					/>
					<button
						onClick={handleEnterChatRoom}
						disabled={!user || !room}
					>
						Enter Chat Room
					</button>
				</div>
			) : (
				<div>
					<h2>Chat Room: {room}</h2>
					<h3>User: {user}</h3>
					<div style={{ marginBottom: 10 }}>
						{messages.map((msg, index) => (
							<p key={index}>{msg}</p>
						))}
					</div>
					<input
						type="text"
						placeholder="Message"
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						onKeyDown={(e) =>
							e.key === "Enter" && handleSendMessage()
						}
					/>
					<button
						onClick={handleSendMessage}
						disabled={!newMessage.trim()}
					>
						Send Message
					</button>
				</div>
			)}
		</div>
	);
}

export default App;
