import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function Home() {
  const [corndogs, setCorndogs] = useState([])

  useEffect(() => {
    fetchCorndogs()
  }, [])

  async function fetchCorndogs() {
    let { data, error } = await supabase.from("Corndogs").select("*")
    if (error) {
      console.error("Error fetching corndogs:", error)
    } else {
      setCorndogs(data)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Hello Vercel + Supabase 👋</h1>
      <h2>Corndogs Table:</h2>
      {corndogs.length === 0 ? (
        <p>No corndogs found.</p>
      ) : (
        <ul>
          {corndogs.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
