import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState("");

  const startChat = () => {
    // generate random session id if empty
    const id = sessionId || Math.random().toString(36).substring(2, 8);
    router.push(`/chat/${id}`);
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Welcome to Uni Anonymous Chat 👋</h1>
      <p>Start or join a chat room by entering a session ID:</p>

      <input
        type="text"
        placeholder="Enter session ID (or leave blank for random)"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
        style={{ padding: "8px", marginRight: "10px" }}
      />
      <button onClick={startChat}>Join Chat</button>
    </div>
  );
}
