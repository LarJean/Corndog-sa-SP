import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { useRouter } from "next/router"

export default function Chat() {
  const router = useRouter()
  const { sessionId } = router.query
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")

  // Load old messages + listen for new ones
  useEffect(() => {
    if (!sessionId) return

    // Fetch existing messages
    const loadMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true })
      setMessages(data)
    }
    loadMessages()

    // Subscribe to new messages
    const channel = supabase
      .channel("room-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `session_id=eq.${sessionId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId])

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input) return
    await supabase.from("messages").insert({
      session_id: sessionId,
      text: input,
    })
    setInput("")
  }

  return (
    <div className="p-4">
      <div className="border h-96 overflow-y-scroll p-2 mb-2">
        {messages.map((msg) => (
          <div key={msg.id}>{msg.text}</div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="border flex-1 p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something..."
        />
        <button className="bg-blue-500 text-white px-4 py-2">Send</button>
      </form>
    </div>
  )
}
