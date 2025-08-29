// pages/index.js

import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const createSession = async () => {
    setLoading(true);

    // Insert new session row
    const { data, error } = await supabase
      .from("sessions")
      .insert([{ created_at: new Date() }])
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error("Error creating session:", error);
      return;
    }

    // Redirect to chat/[sessionId].js
    router.push(`/chat/${data.id}`);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Welcome to Chat</h1>
      <p>Click below to start a new chat session:</p>
      <button
        onClick={createSession}
        disabled={loading}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          backgroundColor: "#4f46e5",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Creating..." : "Start New Chat"}
      </button>
    </div>
  );
}
