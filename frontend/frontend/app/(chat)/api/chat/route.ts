// app/(chat)/api/chat/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/app/(auth)/auth'

export async function POST(request: Request) {
  try {
    // 1️⃣ Ensure the user is signed in
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
    }
    const uid = session.user.id

    // 2️⃣ Pull the incoming message
    const { message }: { message: string | { parts?: any[] } } =
      await request.json()

    // 3️⃣ Normalize to plain text
    let text: string
    if (typeof message === 'string') {
      text = message
    } else if (message.parts && Array.isArray(message.parts)) {
      text = message.parts.map((p: any) => p.text ?? '').join('')
    } else {
      return NextResponse.json({ error: 'Bad message format' }, { status: 400 })
    }

    // 4️⃣ Forward to FastAPI backend
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, message: text }),
      }
    )
    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream ${res.status}` },
        { status: 502 }
      )
    }
    const { reply } = await res.json()

    // 5️⃣ Return a simple JSON payload for your client UI
    return NextResponse.json({ text: reply })
  } catch (e: any) {
    console.error('🔴 /api/chat error:', e)
    return NextResponse.json(
      { error: e.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  // (Optional) implement if you need to clear or delete a chat
  return NextResponse.json({ ok: true })
}
