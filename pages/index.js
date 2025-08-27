import { supabase } from '../lib/supabaseClient'

export default function Home({ messages }) {
  return (
    <div style={{ padding: 20 }}>
      <h1>Hello Vercel + Supabase 👋</h1>
      <h2>Messages from Supabase:</h2>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>{msg.content}</li>
        ))}
      </ul>
    </div>
  )
}

export async function getServerSideProps() {
  const { data: messages, error } = await supabase.from('messages').select('*')

  if (error) console.error(error)

  return {
    props: {
      messages: messages || [],
    },
  }
}
