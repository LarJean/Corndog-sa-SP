import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function Home() {
  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase.from("sessions").select("*");
      if (!error) setSessions(data);
    };
    fetchSessions();
  }, []);

  const createSession = async () => {
    if (!newSession.trim()) return;
    const { data, error } = await supabase
      .from("sessions")
      .insert([{ name: newSession }])
      .select()
      .single();
    if (!error) {
      setSessions([...sessions, data]);
      setNewSession("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">💬 Chat Sessions</h1>

      <div className="w-full max-w-md bg-white shadow rounded p-4">
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={newSession}
            onChange={(e) => setNewSession(e.target.value)}
            className="flex-1 border rounded px-2 py-1"
            placeholder="New session name..."
          />
          <button
            onClick={createSession}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Create
          </button>
        </div>

        {sessions.length === 0 ? (
          <p className="text-gray-500">No sessions yet...</p>
        ) : (
          <ul>
            {sessions.map((s) => (
              <li
                key={s.id}
                className="p-2 border-b cursor-pointer hover:bg-gray-50"
                onClick={() => router.push(`/session/${s.id}`)}
              >
                {s.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
