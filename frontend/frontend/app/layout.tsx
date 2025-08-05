// app/layout.tsx
import React from 'react'
import { Toaster } from 'sonner'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider } from 'next-auth/react'

import './globals.css'

// Import your client-side sidebar context + component
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

export const metadata: Metadata = {
  metadataBase: new URL('https://chat.vercel.ai'),
  title: 'Multi-Agent AI Assistant',
  description: 'Multi-Agent AI Assistant',
}

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
})

// Dynamically update mobile address-bar theme color
const LIGHT = 'hsl(0 0% 100%)'
const DARK  = 'hsl(240deg 10% 3.92%)'
const THEME_SCRIPT = `\
(function(){
  const html=document.documentElement;
  let meta=document.querySelector('meta[name="theme-color"]');
  if(!meta){
    meta=document.createElement('meta');
    meta.name='theme-color';
    document.head.append(meta);
  }
  const update=()=>{
    meta.content=html.classList.contains('dark')? '${DARK}' : '${LIGHT}'
  };
  new MutationObserver(update).observe(html,{attributes:true,attributeFilter:['class']});
  update();
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="antialiased bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider>
          <div className="flex-1 flex flex-col overflow-hidden border-l border-gray-700">
              <SidebarProvider>
                {/* Sidebar with your app-sidebar.tsx */}
                <div className="app-sidebar flex-shrink-0">

                </div>

                {/* Main content area */}
                 <div className="flex-1 flex flex-col overflow-hidden border-l border-gray-700">
                  <Toaster position="top-center" />
                  <main className="flex-1 relative overflow-auto">
                    {children}
                  </main>
                </div>
              </SidebarProvider>
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
