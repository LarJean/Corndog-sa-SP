import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";

export default function ChatSession() {
  const router = useRouter();
  const { sessionId } = router.query;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Load messages + subscribe realtime
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

    // Subscribe to realtime updates
    const channel = supabase
      .channel("realtime:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          if (payload.new.session_id === parseInt(sessionId)) {
            setMessages((prev) => [...prev, payload.new]);
          }
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
      },
    ]);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-xl font-bold mb-4">Chat Session {sessionId}</h1>

      <div className="w-full max-w-md bg-white shadow rounded p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 border rounded p-2">
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages yet...</p>
          ) : (
            messages.map((msg) => (
              <p key={msg.id} className="mb-2">
                {msg.content}
              </p>
            ))
          )}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border rounded px-2 py-1"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
