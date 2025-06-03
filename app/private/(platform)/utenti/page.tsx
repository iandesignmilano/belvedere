// components
import Hero from "@/components/private/sidebar/Hero"
import UsersTable from "@/components/private/users/UsersTable"

// action
import { getUsers } from "@/actions/users"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default async function UsersPage() {

    const users = await getUsers()

    if (!users) { return <>Caricamento....</> }

    return (
        <>
            <Hero path={[{ name: "Utenti" }]} />
            <section className="px-4 pb-4 w-full md:py-2 flex flex-col gap-4">
                <UsersTable users={users} />
            </section>
        </>
    )
}