import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const handleNewChat = () => {
    const newSessionId = Math.random().toString(36).substring(2, 9); // generate random id
    router.push(`/chat/${newSessionId}`); // redirect to chat page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Welcome to Chat</h1>
      <p className="mb-6">Click below to start a new chat session:</p>
      <button
        onClick={handleNewChat}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
      >
        Start New Chat
      </button>
    </div>
  );
}
