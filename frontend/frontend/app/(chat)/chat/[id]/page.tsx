// app/chat/[id]/page.tsx

'use client'

import React from 'react'
import { ChatInterface } from '@/components/ChatInterface'

export default function Page() {
  return (
    // full screen flex container
    <div className="flex h-screen">
      {/* if you have a sidebar in your root layout, it will live alongside this */}
      <div className="flex-1 flex flex-col bg-background">
        {/* optional header */}
        <header className="px-6 py-4 border-b border-gray-700">
          <h1 className="text-lg font-semibold text-gray-100">
            Multi-Agent AI Assistant
          </h1>
        </header>

        {/* the ChatInterface will fill all remaining space */}
        <main className="flex-1">
          <ChatInterface />
        </main>
      </div>
    </div>
  )
}


// // app/(chat)/chat/[id]/page.tsx
// import { cookies } from 'next/headers'
// import { notFound, redirect } from 'next/navigation'
// import { Chat } from '@/components/chat'
// import { DataStreamHandler } from '@/components/data-stream-handler'
// import { auth } from '@/app/(auth)/auth'
// import { getChatById, getMessagesByChatId } from '@/lib/db/queries'
// import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models'
// import { convertToUIMessages } from '@/lib/utils'
// // app/(chat)/chat/[id]/page.tsx
// export default async function Page({ params }: { params: Promise<{id:string}> }) {
//   const { id } = await params;
//   const session = await auth();
//   if (!session) redirect('/api/auth/guest');

//   // Try to load, but don’t 404…
//   let chat = await getChatById({ id });
//   if (!chat) {
//     chat = {
//       id,
//       userId: session.user.id,
//       visibility: 'public',     // or 'private' if you like
//       title: 'Ephemeral Chat',  // just for UI
//       createdAt: new Date(),
//     };
//   }

//   const messagesFromDb = await getMessagesByChatId({ id });
//   const uiMessages = convertToUIMessages(messagesFromDb || []);
//   const cookieStore = await cookies();
//   const chatModelCookie = cookieStore.get('chat-model');
//   const initialChatModel = chatModelCookie?.value ?? DEFAULT_CHAT_MODEL;

//   return (
//     <>
//       <Chat
//         id={chat.id}
//         initialMessages={uiMessages}
//         initialChatModel={initialChatModel}
//         initialVisibilityType={chat.visibility}
//         isReadonly={false}
//         session={session}
//         autoResume
//       />
//       <DataStreamHandler />
//     </>
//   );
// }
