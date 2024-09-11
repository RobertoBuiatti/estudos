import { useState } from "react";
import ChatRoom from "../chatRoom/ChatRoom";
import EnterChat from "../enterChat/EnterChat";

function ChatApp() {
	const [user, setUser] = useState("");
	const [room, setRoom] = useState("");
	const [chatIsVisible, setChatIsVisible] = useState(false);

	const handleEnterChatRoom = () => {
		if (user && room) {
			setChatIsVisible(true);
		}
	};

	return (
		<div style={{ padding: 20 }}>
			{!chatIsVisible ? (
				<EnterChat
					user={user}
					room={room}
					setUser={setUser}
					setRoom={setRoom}
					handleEnterChatRoom={handleEnterChatRoom}
				/>
			) : (
				<ChatRoom user={user} room={room} />
			)}
		</div>
	);
}

export default ChatApp;
