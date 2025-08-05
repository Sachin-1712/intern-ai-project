// components/ChatInterface.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

type Message = { id: string; role: 'user' | 'assistant'; content: string }

export function ChatInterface() {
  const [uid] = useState(() => uuidv4())
  const [messages, setMessages] = useState<Message[]>([
    { id: uuidv4(), role: 'assistant', content: 'Hello there!' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg: Message = { id: uuidv4(), role: 'user', content: input }
    setMessages((all) => [...all, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: uid, message: input }),
      })
      const { text: reply } = await res.json()
      setMessages((all) => [...all, { id: uuidv4(), role: 'assistant', content: reply }])
    } catch {
      setMessages((all) => [
        ...all,
        { id: uuidv4(), role: 'assistant', content: '⚠️ Error connecting to backend.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      {/* messages list */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                m.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-center text-sm italic text-muted-foreground">
            Thinking…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* input bar */}
      <div className="sticky bottom-0 bg-background px-4 py-3 border-t border-border flex items-center gap-2">
        <input
          type="text"
          className="flex-1 bg-input text-input-foreground placeholder:text-muted-foreground px-4 py-3 rounded-full border border-input focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Send a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-primary-foreground disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  )
}
