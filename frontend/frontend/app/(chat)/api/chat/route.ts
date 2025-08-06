// app/(chat)/api/chat/route.ts
import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/app/(auth)/auth'
import {
  createResumableStreamContext,
  type ResumableStreamContext,
} from 'resumable-stream'
import { after } from 'next/server'

// ————————————————————————————————————————————————————————————————
// SSE helper: share a single stream context across invocations
// ————————————————————————————————————————————————————————————————
export let globalStreamContext: ResumableStreamContext | null = null

export function getStreamContext() {
  if (!globalStreamContext) {
    try {
      globalStreamContext = createResumableStreamContext({
        waitUntil: after,
      })
    } catch (err: any) {
      // if you’re missing REDIS_URL, streams will be disabled
      if (err.message.includes('REDIS_URL')) {
        console.warn('Resumable streams disabled: no REDIS_URL')
      } else {
        console.error(err)
      }
    }
  }
  return globalStreamContext
}

// ————————————————————————————————————————————————————————————————
// POST /api/chat → forward to your backend, return JSON
// ————————————————————————————————————————————————————————————————
export async function POST(request: Request) {
  try {
    // 1️⃣ Authenticate
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
    }
    const uid = session.user.id

    // 2️⃣ Parse and normalize message
    const { message }: { message: string | { parts?: any[] } } =
      await request.json()

    let text: string
    if (typeof message === 'string') {
      text = message
    } else if (Array.isArray(message.parts)) {
      text = message.parts.map((p: any) => p.text ?? '').join('')
    } else {
      return NextResponse.json({ error: 'Bad message format' }, { status: 400 })
    }

    // 3️⃣ Call your FastAPI backend
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

    // 4️⃣ Relay reply
    const { reply } = await res.json()
    return NextResponse.json({ text: reply })
  } catch (err: any) {
    console.error('Chat route error:', err)
    return NextResponse.json(
      { error: err.message ?? 'Server error' },
      { status: 500 }
    )
  }
}

// ————————————————————————————————————————————————————————————————
// DELETE /api/chat?id=... (optional; stubbed)
// ————————————————————————————————————————————————————————————————
export async function DELETE(request: NextRequest) {
  // your deletion logic here, or just:
  return NextResponse.json({ ok: true })
}
