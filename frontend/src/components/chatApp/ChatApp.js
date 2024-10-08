import { useState, useEffect } from "react";
import ChatRoom from "../chatRoom/ChatRoom";
import EnterChat from "../enterChat/EnterChat";
import RoomList from "../roomList/RoomList";
import socket from "../socket/socket";

export default function ChatApp() {
	const [user, setUser] = useState(localStorage.getItem("user") || "");
	const [room, setRoom] = useState(localStorage.getItem("room") || "");
	const [chatIsVisible, setChatIsVisible] = useState(false);

	// Armazenar usuário e sala no localStorage sempre que forem definidos
	useEffect(() => {
		if (user) localStorage.setItem("user", user);
		if (room) localStorage.setItem("room", room);
	}, [user, room]);

	// Tentar entrar na sala automaticamente ao carregar a página, se houver user e room
	useEffect(() => {
		if (user && room) {
			setChatIsVisible(true);
			socket.emit("join_room", user, room); // Entra na sala automaticamente
		}
	}, [user, room]);

	const handleEnterChatRoom = () => {
		if (user && room) {
			setChatIsVisible(true);
			socket.emit("join_room", user, room); // Quando o usuário entra em uma sala
		}
	};

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
		<div>
			<h1>Faz o L</h1>			
		</div>
	);
}
