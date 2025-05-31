// components
import Hero from "@/components/private/sidebar/Hero"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default async function TablesPage() {
    return (
        <>
            <Hero path={[{ name: "Tavoli" }]} />
            <section className="px-4 pb-4 w-full md:py-2 flex flex-col gap-4"></section>
        </>
    )
}