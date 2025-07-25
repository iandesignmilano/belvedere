// components
import Hero from "@/components/private/sidebar/Hero"
import ReservationsList from "@/components/private/reservations/ReservationsList"

// action
import { verifyAuth } from "@/lib/session"
import { getProfilePrivileges } from "@/actions/profile"
import { getReservations } from "@/actions/reservations"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default async function ReservationsPage() {

    const user = await getProfilePrivileges()
    const privileges = (user?.superuser ? "all" : user?.privileges) as string

    const auth = await verifyAuth()

    const reservations = await getReservations()

    if (!reservations) { return <>Caricamento....</> }

    return (
        <>
            <Hero path={[{ name: "Prenotazioni" }]} />
            <section className="px-4 pb-4 w-full md:py-2 flex flex-col gap-4">
                <ReservationsList reservations={reservations} user={auth.user?.id} privileges={privileges} />
            </section>
        </>
    )
}