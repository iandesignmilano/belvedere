// next
import { redirect } from "next/navigation"

// auth
import { verifyAuth } from "@/lib/session"

// shad
import { SidebarProvider } from "@/components/ui/sidebar"

// components
import Bar from "@/components/private/sidebar/Sidebar"

// socket
import SocketProvider from "@/components/custom/Socket"

// action
import { getProfilePrivileges } from "@/actions/profile"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default async function layout({ children }: { children: React.ReactNode }) {

    // check
    const auth = await verifyAuth()

    // user not auth
    if (!auth.user) return redirect('/private/login')

    // privileges
    const user = await getProfilePrivileges()
    const privileges = (user?.superuser ? "all" : user?.privileges) as string

    // user auth
    return (
        <SocketProvider>
            <SidebarProvider>
                <Bar privileges={privileges} />
                <main className="w-full">
                    {children}
                </main>
            </SidebarProvider>
        </SocketProvider>
    )
}