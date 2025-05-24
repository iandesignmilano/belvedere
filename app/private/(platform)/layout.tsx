// next
import { redirect } from "next/navigation"

// auth
import { verifyAuth } from "@/lib/session"

// shad
import { SidebarProvider } from "@/components/ui/sidebar"

// components
import Bar from "@/components/private/sidebar/Sidebar"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default async function layout({ children }: { children: React.ReactNode }) {

    // // check
    const auth = await verifyAuth()

    // user not auth
    if (!auth.user) return redirect('/private/login')

    // user auth
    return (
        <SidebarProvider>
            <Bar />
            <main className="w-full">
                {children}
            </main>
        </SidebarProvider>
    )
}