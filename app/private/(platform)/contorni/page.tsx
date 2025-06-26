// components
import Hero from "@/components/private/sidebar/Hero"
import ListElements from "@/components/private/lists/ListElements"

// action
import { getProfilePrivileges } from "@/actions/profile"
import { getOutlines } from "@/actions/outlines"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default async function OutlinePage() {

    const user = await getProfilePrivileges()
    const privileges = (user?.superuser ? "all" : user?.privileges) as string

    const outlines = await getOutlines()

    if (!outlines) { return <>Caricamento....</> }

    return (
        <>
            <Hero path={[{ name: "Contorni" }]} />
            <section className="px-4 pb-4 w-full md:py-2 flex flex-col gap-4">
                <ListElements elements={outlines} privileges={privileges} name="contorno" />
            </section>
        </>
    )
}