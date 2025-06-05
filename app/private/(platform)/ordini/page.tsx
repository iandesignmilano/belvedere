// components
import Hero from "@/components/private/sidebar/Hero"
import OrderList from "@/components/private/orders/OrderList"

// action
import { getOrders } from "@/actions/orders"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default async function OrdersPage() {

    const orders = await getOrders()

    if (!orders) { return <>Caricamento....</> }

    return (
        <>
            <Hero path={[{ name: "Ordini" }]} />
            <section className="px-4 pb-4 w-full md:py-2 flex flex-col gap-4">
                <OrderList orders={orders} />
            </section>
        </>
    )
}