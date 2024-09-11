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

// Lista de salas
const rooms = new Set();

// Função para gerenciar quando o socket se conecta
const handleConnection = (socket) => {
	console.log(`A user connected: ${socket.id}`);

	// Enviar lista de salas abertas para o cliente ao conectar
	socket.emit("update_rooms", Array.from(rooms));

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
	});
};

// Função para tratar quando o usuário entra em uma sala
const handleJoinRoom = (socket, user, room) => {
	if (room) {
		socket.join(room);
		rooms.add(room);
		io.emit("update_rooms", Array.from(rooms)); // Atualiza a lista de salas para todos os clientes
		console.log(`User ${user} joined room: ${room}`);
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
		// Verificar se a sala está vazia antes de removê-la
		const clients = io.sockets.adapter.rooms.get(room);
		if (!clients || clients.size === 0) {
			rooms.delete(room);
		}
		io.emit("update_rooms", Array.from(rooms)); // Atualiza a lista de salas para todos os clientes
		console.log(`User ${socket.id} left room: ${room}`);
	} else {
		console.error("Room is undefined or null");
	}
};

// Evento de conexão do socket
io.on("connection", handleConnection);

// Inicializando o servidor HTTP
server.listen(port, () => {
	console.log(`Listening on port: ${port}`);
});
