import { useState, useEffect } from "react";
import ChatRoom from "../chatRoom/ChatRoom";
import EnterChat from "../enterChat/EnterChat";
import socket from "../socket/socket";

export default function ChatApp() {
	const [user, setUser] = useState("");
	const [room, setRoom] = useState("");
	const [chatIsVisible, setChatIsVisible] = useState(false);
	const [openRooms, setOpenRooms] = useState([]);

	useEffect(() => {
		// Ouve as atualizações da lista de salas abertas
		socket.on("update_rooms", (rooms) => {
			console.log("Salas recebidas:", rooms); // Verifica se as salas estão sendo recebidas
			setOpenRooms(rooms);
		});

		return () => {
			socket.off("update_rooms");
		};
	}, []);

	const handleEnterChatRoom = () => {
		if (user && room) {
			setChatIsVisible(true);
		}
	};

	// Função para permitir que o usuário entre em uma sala ao clicar nela
	const handleJoinRoom = (selectedRoom) => {
		if (user) {
			setRoom(selectedRoom);
			setChatIsVisible(true);
		} else {
			alert("Please enter a username before joining a room.");
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

					{/* Lista de salas abertas */}
					<h3>Salas de Chat Abertas:</h3>
					<ul>
						{openRooms.length > 0 ? (
							openRooms.map((r, index) => (
								<li key={index}>
									<button onClick={() => handleJoinRoom(r)}>
										Entrar na sala {r}
									</button>
								</li>
							))
						) : (
							<p>Não há salas abertas no momento.</p>
						)}
					</ul>
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
