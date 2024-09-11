import { useEffect, useState } from "react";
import socket from "../socket/socket";

export default function RoomList({ setRoom, setChatIsVisible }) {
	const [rooms, setRooms] = useState([]);

	useEffect(() => {
		socket.on("update_rooms", (updatedRooms) => {
			setRooms(updatedRooms);
		});

		return () => {
			socket.off("update_rooms");
		};
	}, []);

	const handleJoinRoom = (room) => {
		setRoom(room);
		setChatIsVisible(true);
	};

	return (
		<div>
			<h3>Salas Abertas</h3>
			<ul>
				{rooms.map((room, index) => (
					<li key={index}>
						<button onClick={() => handleJoinRoom(room)}>
							{room}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
