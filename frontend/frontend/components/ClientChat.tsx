'use client'
import { Chat } from '@/components/chat'
import { DataStreamHandler } from '@/components/data-stream-handler'
import type { Session } from 'next-auth'
import type { ChatMessage } from '@/lib/types'
import type { VisibilityType } from '@/components/visibility-selector'

interface ClientChatProps {
  id: string
  initialMessages: ChatMessage[]        // use ChatMessage here
  initialChatModel: string
  initialVisibilityType: VisibilityType
  isReadonly: boolean
  session: Session
}

export function ClientChat(props: ClientChatProps) {
  return (
    <>
      <Chat {...props} autoResume={true} />
      <DataStreamHandler />
    </>
  )
}
