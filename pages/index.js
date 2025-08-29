import { useRouter } from "next/router";
import { useState } from "react";

export default function IndexPage() {
  const router = useRouter();
  const [name, setName] = useState("");

  const handleStart = () => {
    if (!name.trim()) return alert("Enter your name first!");
    // Fixed session for 2 people
    router.push(`/chat/main?name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-96 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Welcome to Chat 💬
        </h1>
        <input
          type="text"
          placeholder="Enter your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={handleStart}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Start Chat
        </button>
      </div>
    </div>
  );
}
