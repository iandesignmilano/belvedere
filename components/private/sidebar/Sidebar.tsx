// shad
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarFooter } from "@/components/ui/sidebar"

// components
import { SidebarButton, SidebarLogoutButton } from "./SidebarButtons"

// icons
import { User, Users, Calendar, Pizza, Utensils, Blocks, CupSoda, Salad, Settings } from "lucide-react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// items
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const app = [
    {
        title: "Tavoli",
        url: "/private/tavoli",
        icon: <Blocks />
    },
    {
        title: "Impostazioni",
        url: "/private/impostazioni",
        icon: <Settings />
    }
]

const lists = [
    {
        title: "Ingredienti",
        url: "/private/ingredienti",
        icon: <Utensils />,
    },
    {
        title: "Menù",
        url: "/private/menu",
        icon: <Pizza />,
    },
    {
        title: "Contorni",
        url: "/private/contorni",
        icon: <Salad />,
    },
    {
        title: "Bibite",
        url: "/private/bibite",
        icon: <CupSoda />,
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
        icon: <Users />,
        superuser: true
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

export default function Bar({ privileges }: { privileges: string }) {

    const settingsMenu = privileges == "all" ? settings : settings.filter((el) => !el.superuser)

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
                    <SidebarGroupLabel>Liste</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {lists.map((item, index) => (
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
                            {settingsMenu.map((item, index) => (
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