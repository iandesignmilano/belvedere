// next
import { redirect } from "next/navigation"

// components
import Hero from "@/components/private/sidebar/Hero"
import OrderAdd from "@/components/private/orders/OrderAdd"

// action
import { verifyAuth } from "@/lib/session"
import { getProfilePrivileges } from "@/actions/profile"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default async function AddOrderPage() {

    const user = await getProfilePrivileges()
    const privileges = (user?.superuser ? "all" : user?.privileges) as string
    if (!(privileges === "all" || privileges.includes("create"))) redirect("/private/ordini")

    const auth = await verifyAuth()

    return (
        <>
            <Hero
                path={[
                    { name: "Ordini", link: "/private/ordini" },
                    { name: "Aggiungi" }
                ]}
            />
            <section className="px-4 pb-4 w-full md:py-2 flex flex-col gap-4">
                <OrderAdd user={auth.user?.id} />
            </section>
        </>
    )
}