import { useState } from "react";
import socket from "../socket/socket";

function MessageInput({ user, room, setMessages }) {
	const [newMessage, setNewMessage] = useState("");

	const handleSendMessage = () => {
		if (newMessage.trim()) {
			socket.emit("send_message", room, user, newMessage);
			setMessages((prevState) => [
				`${user} sent: ${newMessage}`,
				...prevState,
			]);
			setNewMessage("");
		}
	};

	return (
		<div>
			<input
				type="text"
				placeholder="Message"
				value={newMessage}
				onChange={(e) => setNewMessage(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
			/>
			<button onClick={handleSendMessage} disabled={!newMessage.trim()}>
				Send Message
			</button>
		</div>
	);
}

export default MessageInput;
