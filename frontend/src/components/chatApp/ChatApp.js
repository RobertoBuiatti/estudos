import { useState, useEffect } from "react";
import ChatRoom from "../chatRoom/ChatRoom";
import EnterChat from "../enterChat/EnterChat";
import RoomList from "../roomList/RoomList";
import socket from "../socket/socket";

export default function ChatApp() {
	const [user, setUser] = useState("");
	const [room, setRoom] = useState("");
	const [chatIsVisible, setChatIsVisible] = useState(false);

	const handleEnterChatRoom = () => {
		if (user && room) {
			setChatIsVisible(true);
		}
	};

	useEffect(() => {
		// Atualizar lista de salas quando o componente monta
		socket.on("update_rooms", (updatedRooms) => {
			// Aqui, você pode armazenar a lista de salas no estado ou usar uma abordagem semelhante
			// para garantir que a lista de salas esteja atualizada.
		});

		return () => {
			socket.off("update_rooms");
		};
	}, []);

	return (
		<div style={{ padding: 20 }}>
			{!chatIsVisible ? (
				<div>
					<EnterChat
						user={user}
						room={room}
						setUser={setUser}
						setRoom={setRoom}
						handleEnterChatRoom={handleEnterChatRoom}
					/>
					<RoomList
						setRoom={setRoom}
						setChatIsVisible={setChatIsVisible}
					/>
				</div>
			) : (
				<ChatRoom
					user={user}
					room={room}
					setChatIsVisible={setChatIsVisible}
				/>
			)}
		</div>
	);
}
