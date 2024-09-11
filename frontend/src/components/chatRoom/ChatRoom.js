import { useEffect, useState } from "react";
import socket from "../socket/socket";
import MessageInput from "../messageInput/MessageInput";
import MessageList from "../messageList/MessageList";
import ConnectionStatus from "../connectionStatus/ConnectionStatus";

function ChatRoom({ user, room }) {
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		socket.emit("join_room", user, room);

		socket.on("receive_message", ({ user, message }) => {
			const msg = `${user} sent: ${message}`;
			setMessages((prevState) => [msg, ...prevState]);
		});

		return () => {
			socket.off("receive_message");
		};
	}, [user, room]);

	return (
		<div>
			<ConnectionStatus />
			<h2>Chat Room: {room}</h2>
			<h3>User: {user}</h3>
			<MessageList messages={messages} />
			<MessageInput user={user} room={room} setMessages={setMessages} />
		</div>
	);
}

export default ChatRoom;
