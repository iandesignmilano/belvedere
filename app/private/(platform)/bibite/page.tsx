// components
import Hero from "@/components/private/sidebar/Hero"
import ListElements from "@/components/private/lists/ListElements"

// action
import { getProfilePrivileges } from "@/actions/profile"
import { getDrinks } from "@/actions/drinks"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default async function DrinksPage() {

    const user = await getProfilePrivileges()
    const privileges = (user?.superuser ? "all" : user?.privileges) as string

    const drinks = await getDrinks()

    if (!drinks) { return <>Caricamento....</> }

    return (
        <>
            <Hero path={[{ name: "Bibite" }]} />
            <section className="px-4 pb-4 w-full md:py-2 flex flex-col gap-4">
                <ListElements elements={drinks} privileges={privileges} name="bibita" />
            </section>
        </>
    )
}