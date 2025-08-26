// action
import { getSettings } from "@/actions/settings"

// import
import ReservationPage from "./ReservationPage"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default async function Page() {

    const settings = await getSettings()

    let stop = false
    let gap = 90
    if (settings) {
        stop = settings.stop_prenotazioni
        gap = settings.prenotazione * 60
    }

    return (
        <section>
            <ReservationPage stop={stop} gap={gap} />
        </section>
    )
}