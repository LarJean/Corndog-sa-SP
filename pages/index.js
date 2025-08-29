// pages/index.js

import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const createSession = async () => {
    setLoading(true);

    // Insert new session
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

    // Redirect to chat page
    router.push(`/chat/${data.id}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to Chat</h1>
      <button
        onClick={createSession}
        disabled={loading}
        style={{ padding: "10px 20px" }}
      >
        {loading ? "Creating..." : "Start New Chat"}
      </button>
    </div>
  );
}
