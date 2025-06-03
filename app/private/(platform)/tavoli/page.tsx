// components
import Hero from "@/components/private/sidebar/Hero"
import TablesList from "@/components/private/tables/TablesList"

// actions
import { getTables } from "@/actions/tables"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default async function TablesPage() {

    const tables = await getTables()

    if (!tables) { return <>Caricamento....</> }

    return (
        <>
            <Hero path={[{ name: "Tavoli" }]} />
            <section className="px-4 pb-4 w-full md:py-2 flex flex-col gap-4">
                <TablesList tables={tables} />
            </section>
        </>
    )
}