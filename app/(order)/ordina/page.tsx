// action
import { getSettings } from "@/actions/settings"

// import
import OrderPage from "./OrderPage"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default async function Layout() {

    const settings = await getSettings()

    let stop = false
    if (settings) stop = settings.stop_ordini

    return (
        <section>
            <OrderPage stop={stop} />
        </section>
    )
}