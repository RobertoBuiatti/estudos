export default function EnterChat({ user, room, setUser, setRoom, handleEnterChatRoom }) {
	return (
		<div>
			<input
				type="text"
				placeholder="Usuario"
				value={user}
				onChange={(e) => setUser(e.target.value)}
				style={{ marginBottom: 10 }}
			/>
			<input
				type="text"
				placeholder="Sala"
				value={room}
				onChange={(e) => setRoom(e.target.value)}
				style={{ marginBottom: 10 }}
			/>
			<button onClick={handleEnterChatRoom} disabled={!user || !room}>
				Entrar Na sala
			</button>
		</div>
	);
}
