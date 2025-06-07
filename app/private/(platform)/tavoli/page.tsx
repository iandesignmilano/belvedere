// components
import Hero from "@/components/private/sidebar/Hero"
import TablesList from "@/components/private/tables/TablesList"

// actions
import { getProfilePrivileges } from "@/actions/profile"
import { getTables } from "@/actions/tables"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default async function TablesPage() {

    const user = await getProfilePrivileges()
    const privileges = (user?.superuser ? "all" : user?.privileges) as string

    const tables = await getTables()

    if (!tables) { return <>Caricamento....</> }

    return (
        <>
            <Hero path={[{ name: "Tavoli" }]} />
            <section className="px-4 pb-4 w-full md:py-2 flex flex-col gap-4">
                <TablesList tables={tables} privileges={privileges} />
            </section>
        </>
    )
}