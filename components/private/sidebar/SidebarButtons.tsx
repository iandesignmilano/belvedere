"use client"

// next
import Link from "next/link"
import { usePathname } from "next/navigation"

// shad
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { useSidebar } from "@/components/ui/sidebar"

// components
import { ToastDanger } from "@/components/custom/Toast"

// actions
import { logoutAction } from "@/actions/auth"

// icons
import { LogOut } from "lucide-react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface SidebarButtonProps {
    icon: React.ReactNode;
    name: string;
    path: string;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export function SidebarButton({ icon, name, path }: SidebarButtonProps) {

    const pt = usePathname()

    const { toggleSidebar } = useSidebar()

    return (
        <SidebarMenuButton
            asChild
            isActive={path == pt}
            className="data-[active=true]:bg-primary data-[active=true]:text-white hover:bg-primary hover:text-white transition-all duration-200 ease-in-out"
        >
            <Link href={path} onClick={toggleSidebar}>
                {icon}
                <span>{name}</span>
            </Link>
        </SidebarMenuButton>
    )
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// logout
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export function SidebarLogoutButton() {

    async function logout() {
        try { await logoutAction() }
        catch (err) {
            if (err && typeof err === "object" && "digest" in err) return
            ToastDanger()
        }
    }

    return (
        <SidebarMenuButton className="text-primary hover:text-white hover:bg-primary cursor-pointer" onClick={logout}>
            <LogOut />
            <span>logout</span>
        </SidebarMenuButton>
    )
}

