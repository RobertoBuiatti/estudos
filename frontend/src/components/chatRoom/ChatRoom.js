import { useEffect, useState } from "react";
import socket from "../socket/socket";
import MessageInput from "../messageInput/MessageInput";
import MessageList from "../messageList/MessageList";
import ConnectionStatus from "../connectionStatus/ConnectionStatus";

export default function ChatRoom({ user, room, setChatIsVisible }) {
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		// Armazenar user e room no localStorage
		localStorage.setItem("user", user);
		localStorage.setItem("room", room);

		socket.emit("join_room", user, room);

		socket.on("receive_message", ({ user, message }) => {
			const msg = `${user} sent: ${message}`;
			setMessages((prevState) => [msg, ...prevState]);
		});

		return () => {
			socket.off("receive_message");
			socket.emit("leave_room", room); // Informar o servidor que o usuário está saindo
			// Limpar os dados do localStorage quando sair da sala
			localStorage.removeItem("user");
			localStorage.removeItem("room");
		};
	}, [user, room]);

	const handleDisconnect = () => {
		socket.emit("leave_room", room);
		// Limpar os dados do localStorage ao desconectar
		localStorage.removeItem("user");
		localStorage.removeItem("room");
		setChatIsVisible(false); // Voltar para a tela de entrada
	};

	return (
		<div>
			<ConnectionStatus />
			<h2>Sala: {room}</h2>
			<h3>Usuário: {user}</h3>
			<MessageList messages={messages} />
			<MessageInput user={user} room={room} setMessages={setMessages} />
			<button onClick={handleDisconnect}>Desconectar</button>
		</div>
	);
}
