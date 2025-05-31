// shad
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarFooter } from "@/components/ui/sidebar"

// components
import { SidebarButton, SidebarLogoutButton } from "./SidebarButtons"

// icons
import { Home, User, Users, Calendar, Pizza, Utensils, Blocks } from "lucide-react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// items
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const app = [
    {
        title: "Dashboard",
        url: "/private",
        icon: <Home />
    },
    {
        title: "Tavoli",
        url: "/private/tavoli",
        icon: <Blocks />
    },
    {
        title: "Ingredienti",
        url: "/private/ingredienti",
        icon: <Utensils />,
    }
]

const order = [
    {
        title: "Prenotazioni",
        url: "/private/prenotazioni",
        icon: <Calendar />
    },
    {
        title: "Ordini",
        url: "/private/ordini",
        icon: <Pizza />
    }
]

const settings = [
    {
        title: "Utenti",
        url: "/private/utenti",
        icon: <Users />
    },
    {
        title: "Profilo",
        url: "/private/profilo",
        icon: <User />
    }
]

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Bar() {
    return (
        <Sidebar variant="floating" collapsible="icon" className="pr-0">

            {/* CONTENT */}
            <SidebarContent>

                {/* app */}
                <SidebarGroup>
                    <SidebarGroupLabel>App</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {app.map((item, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarButton name={item.title} icon={item.icon} path={item.url} />
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* app */}
                <SidebarGroup>
                    <SidebarGroupLabel>Gestione</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {order.map((item, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarButton name={item.title} icon={item.icon} path={item.url} />
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* settings */}
                <SidebarGroup>
                    <SidebarGroupLabel>Impostazioni</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {settings.map((item, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarButton name={item.title} icon={item.icon} path={item.url} />
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* FOOTER */}
            <SidebarFooter>
                <SidebarLogoutButton />
            </SidebarFooter>
        </Sidebar>
    )
}