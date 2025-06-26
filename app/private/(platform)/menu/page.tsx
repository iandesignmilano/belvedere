// components
import Hero from "@/components/private/sidebar/Hero"
import ListElements from "@/components/private/lists/ListElements"

// action
import { getProfilePrivileges } from "@/actions/profile"
import { getMenu } from "@/actions/menu"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default async function MenuPage() {

    const user = await getProfilePrivileges()
    const privileges = (user?.superuser ? "all" : user?.privileges) as string

    const menu = await getMenu()

    if (!menu) { return <>Caricamento....</> }

    return (
        <>
            <Hero path={[{ name: "Menù" }]} />
            <section className="px-4 pb-4 w-full md:py-2 flex flex-col gap-4">
                <ListElements elements={menu} privileges={privileges} name="pizza" />
            </section>
        </>
    )
}