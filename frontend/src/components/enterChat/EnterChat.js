export default function EnterChat({ user, room, setUser, setRoom, handleEnterChatRoom }) {
	return (
		<div>
			<input
				type="text"
				placeholder="User"
				value={user}
				onChange={(e) => setUser(e.target.value)}
				style={{ marginBottom: 10 }}
			/>
			<input
				type="text"
				placeholder="Room"
				value={room}
				onChange={(e) => setRoom(e.target.value)}
				style={{ marginBottom: 10 }}
			/>
			<button onClick={handleEnterChatRoom} disabled={!user || !room}>
				Enter Chat Room
			</button>
		</div>
	);
}
