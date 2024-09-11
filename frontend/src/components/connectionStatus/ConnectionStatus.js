import { useEffect, useState } from "react";
import socket from "../socket/socket";

function ConnectionStatus() {
	const [isConnected, setIsConnected] = useState(socket.connected);

	useEffect(() => {
		socket.on("connect", () => {
			setIsConnected(true);
		});

		socket.on("disconnect", () => {
			setIsConnected(false);
		});

		return () => {
			socket.off("connect");
			socket.off("disconnect");
		};
	}, []);

	return <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>;
}

export default ConnectionStatus;
