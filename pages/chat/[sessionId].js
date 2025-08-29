import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";

export default function ChatSession() {
  const router = useRouter();
  const { sessionId } = router.query;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Load existing messages
  useEffect(() => {
    if (!sessionId) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (!error) setMessages(data);
    };

    loadMessages();
  }, [sessionId]);

  // Subscribe to new messages in realtime
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`messages-channel-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          console.log("New message received:", payload.new);
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await supabase.from("messages").insert([
      {
        session_id: sessionId,
        content: newMessage,
        created_at: new Date(),
      },
    ]);

    setNewMessage("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Chat Session {sessionId}</h1>
      <div style={{ marginBottom: "20px", maxHeight: "300px", overflowY: "auto" }}>
        {messages.map((msg) => (
          <p key={msg.id}>
            <strong>{msg.id}:</strong> {msg.content}
          </p>
        ))}
      </div>

      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ padding: "8px", width: "70%" }}
      />
      <button onClick={sendMessage} style={{ marginLeft: "10px", padding: "8px 16px" }}>
        Send
      </button>
    </div>
  );
}
