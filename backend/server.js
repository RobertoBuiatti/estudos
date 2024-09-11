const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = createServer(app);
const port = 3001;

// Configurando o middleware CORS
app.use(cors({ origin: "http://localhost:3000" }));

// Inicializando o servidor Socket.io
const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

// Armazenar as salas e os usuários conectados
const rooms = {};

// Função para gerenciar quando o socket se conecta
const handleConnection = (socket) => {
	console.log(`A user connected: ${socket.id}`);

	// Gerenciando evento de entrada em uma sala
	socket.on("join_room", (user, room) => handleJoinRoom(socket, user, room));

	// Gerenciando envio de mensagem para a sala
	socket.on("send_message", (room, user, message) =>
		handleSendMessage(socket, room, user, message)
	);

	// Gerenciando evento de saída da sala
	socket.on("leave_room", (room) => handleLeaveRoom(socket, room));

	// Gerenciando quando o usuário desconecta
	socket.on("disconnect", () => {
		console.log(`User disconnected: ${socket.id}`);
		handleUserDisconnect(socket); // Nova função para tratar desconexões
	});
};

// Função para tratar quando o usuário entra em uma sala
const handleJoinRoom = (socket, user, room) => {
	if (room) {
		socket.join(room);
		if (!rooms[room]) {
			rooms[room] = []; // Inicializa a sala se ela não existir
		}
		rooms[room].push(socket.id); // Adiciona o usuário à sala

		console.log(`User ${user} joined room: ${room}`);
		console.log(`Users in room ${room}:`, rooms[room]);
	} else {
		console.error("Room is undefined or null");
	}
};

// Função para tratar o envio de mensagem
const handleSendMessage = (socket, room, user, message) => {
	if (room && user && message) {
		const data = { user, message };
		socket.to(room).emit("receive_message", data); // Envia a mensagem para os outros clientes na sala
		console.log(`Message from ${user} in room ${room}: ${message}`);
	} else {
		console.error("Room, user or message is missing");
	}
};

// Função para tratar quando o usuário sai da sala
const handleLeaveRoom = (socket, room) => {
	if (room) {
		socket.leave(room);
		if (rooms[room]) {
			rooms[room] = rooms[room].filter((id) => id !== socket.id); // Remove o usuário da sala
			console.log(`User ${socket.id} left room: ${room}`);
			console.log(`Remaining users in room ${room}:`, rooms[room]);

			if (rooms[room].length === 0) {
				// Se não houver mais usuários na sala, remove a sala
				delete rooms[room];
				console.log(`Room ${room} closed because no users are left.`);
			}
		}
	} else {
		console.error("Room is undefined or null");
	}
};

// Função para tratar quando o usuário desconecta
const handleUserDisconnect = (socket) => {
	for (const room in rooms) {
		if (rooms[room].includes(socket.id)) {
			handleLeaveRoom(socket, room); // Remove o usuário da sala ao desconectar
		}
	}
};

// Evento de conexão do socket
io.on("connection", handleConnection);

// Inicializando o servidor HTTP
server.listen(port, () => {
	console.log(`Listening on port: ${port}`);
});
