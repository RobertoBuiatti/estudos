function MessageList({ messages }) {
	return (
		<div style={{ marginBottom: 10 }}>
			{messages.map((msg, index) => (
				<p key={index}>{msg}</p>
			))}
		</div>
	);
}

export default MessageList;
