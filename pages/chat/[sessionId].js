// pages/chat/[sessionId].js

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";

export default function ChatPage() {
  const router = useRouter();
  const { sessionId } = router.query;
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  // Load existing messages + subscribe for realtime updates
  useEffect(() => {
    if (!sessionId) return;

    // Fetch existing messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();

    // Realtime subscription
 const channel = supabase
  .channel(`messages-channel-${sessionId}`) // 👈 unique channel name per session
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "messages",
      filter: `session_id=eq.${sessionId}`, // 👈 must match inserted session_id exactly
    },
    (payload) => {
      console.log("New message received:", payload.new); // Debug
      setMessages((prev) => [...prev, payload.new]);
    }
  )
  .subscribe();


    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  // Send a message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const { error } = await supabase.from("messages").insert([
      {
        session_id: sessionId,
        content: content.trim(),
      },
    ]);

    if (error) {
      console.error("Error sending message:", error);
    } else {
      setContent("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chat Session: {sessionId}</h1>

      {/* Messages list */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {messages.length === 0 ? (
          <p>No messages yet...</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} style={{ marginBottom: "5px" }}>
              <strong>{msg.user_id || "Anon"}:</strong> {msg.content}
            </div>
          ))
        )}
      </div>

      {/* Send message form */}
      <form onSubmit={sendMessage} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Send
        </button>
      </form>
    </div>
  );
}
