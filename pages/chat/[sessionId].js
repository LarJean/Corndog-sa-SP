import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";

export default function ChatPage() {
  const router = useRouter();
  const { sessionId } = router.query;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!sessionId) return;

    // Load existing messages
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading messages:", error);
      } else {
        setMessages(data || []);
      }
    };

    loadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel("messages-room")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `session_id=eq.${sessionId}`, // ✅ only listen for this session
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    // cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const sendMessage = async () => {
  if (!input.trim()) return;
  const { data, error } = await supabase.from("messages").insert([
    { session_id: sessionId, content: input }
  ]);
  console.log("Insert result:", { data, error });
  setInput("");
};

  return (
    <div>
      <h1>Chat Room: {sessionId}</h1>
      <div>
        {messages.map((msg) => (
          <p key={msg.id}>{msg.content}</p>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Say something..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
