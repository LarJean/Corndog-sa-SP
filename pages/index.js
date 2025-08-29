import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const startChat = async () => {
    // Create a new session row
    const { data, error } = await supabase
      .from("sessions")
      .insert([{ created_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) {
      console.error("Error creating session:", error);
      return;
    }

    // Redirect to the chat session
    router.push(`/chat/${data.id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">💬 Welcome to Chat</h1>
        <button
          onClick={startChat}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
        >
          Start New Chat
        </button>
      </div>
    </div>
  );
}
