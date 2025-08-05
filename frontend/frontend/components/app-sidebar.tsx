// components/ui/AppSidebar.tsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { PlusIcon } from './icons';
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, useSidebar } from './ui/sidebar';
import { SidebarHistory } from './sidebar-history';
import { SidebarUserNav } from './sidebar-user-nav';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { Button } from './ui/button';
import type { User } from 'next-auth';

type AppSidebarProps = { user?: User };

export function AppSidebar({ user }: AppSidebarProps) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  function handleNewChat() {
    setOpenMobile(false);
    // generate a brand-new conversation ID and navigate there:
    const newId = uuidv4();
    router.push(`/chat/${newId}`);
  }

  return (
    <Sidebar className="border-r border-gray-200 dark:border-gray-800 group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              href="/"
              onClick={() => setOpenMobile(false)}
              className="flex flex-row gap-3 items-center"
            >
              <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                Home
              </span>
            </Link>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit"
                  onClick={handleNewChat}
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">New Chat</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* this will fetch /api/history and render links to /chat/[id] */}
        <SidebarHistory user={user} />
      </SidebarContent>

      <SidebarFooter>
        {user && <SidebarUserNav user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}

// // 'use client';

// import type { User } from 'next-auth';
// import { useRouter } from 'next/navigation';

// import { PlusIcon } from '@/components/icons';
// import { SidebarHistory } from '@/components/sidebar-history';
// import { SidebarUserNav } from '@/components/sidebar-user-nav';
// import { Button } from '@/components/ui/button';
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarMenu,
//   useSidebar,
// } from '@/components/ui/sidebar';
// import Link from 'next/link';
// import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

// export function AppSidebar({ user }: { user: User | undefined }) {
//   const router = useRouter();
//   const { setOpenMobile } = useSidebar();

//   return (
//     <Sidebar className="group-data-[side=left]:border-r-0">
//       <SidebarHeader>
//         <SidebarMenu>
//           <div className="flex flex-row justify-between items-center">
//             <Link
//               href="/"
//               onClick={() => {
//                 setOpenMobile(false);
//               }}
//               className="flex flex-row gap-3 items-center"
//             >
//               <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
//                 Chatbot
//               </span>
//             </Link>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   type="button"
//                   className="p-2 h-fit"
//                   onClick={() => {
//                     setOpenMobile(false);
//                     router.push('/');
//                     router.refresh();
//                   }}
//                 >
//                   <PlusIcon />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent align="end">New Chat</TooltipContent>
//             </Tooltip>
//           </div>
//         </SidebarMenu>
//       </SidebarHeader>
//       <SidebarContent>
//         <SidebarHistory user={user} />
//       </SidebarContent>
//       <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
//     </Sidebar>
//   );
// }
