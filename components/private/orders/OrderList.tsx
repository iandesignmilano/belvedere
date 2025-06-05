"use client"

import React, { useState, useEffect } from "react"

// shad
import { Separator } from "../../ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// actions and hook
import { getOrders, OrdersProps, ItemsProps } from "@/actions/orders"
import { useSocket } from "@/components/custom/Socket"

// icons
import { House, Bike, Pizza, Plus, BadgeEuro } from "lucide-react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function OrderList({ orders }: { orders: OrdersProps[] }) {

    const { updateData, setUpdateData } = useSocket()

    const shipping = "9.00"

    // --------------------------------------------------------------
    // totals
    // --------------------------------------------------------------

    const getTotal = (order: ItemsProps[], type: string) => {
        const totalOrderPrice = order.reduce((sum, order) => sum + parseFloat(order.total), 0)
        const commission = totalOrderPrice * 0.015 + 0.25
        const totalPartial = (totalOrderPrice + commission + 2).toFixed(2).toString()
        const total = (parseFloat(totalPartial) + parseFloat(shipping)).toFixed(2).toString()
        return type == "domicile" ? total : totalPartial
    }

    const getServicePrice = (order: ItemsProps[]) => {
        const totalOrderPrice = order.reduce((sum, order) => sum + parseFloat(order.total), 0)
        const commission = totalOrderPrice * 0.015 + 0.25
        return (commission + 2).toFixed(2).toString()
    }

    // --------------------------------------------------------------
    // data
    // --------------------------------------------------------------

    const [list, setList] = useState<OrdersProps[]>(orders)
    useEffect(() => { setList(orders) }, [orders])

    // --------------------------------------------------------------
    // web socket
    // --------------------------------------------------------------

    useEffect(() => {
        async function newData() {
            if (updateData == "order") {
                const newData = await getOrders()
                if (newData) setList(newData)
                setUpdateData("")
            }
        }
        newData()
    }, [updateData, setUpdateData])

    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------

    return (
        <>
            <div className="grid lg:grid-cols-2 gap-4">

            </div>
            <Separator />

            {list.length == 0 && (
                <h2 className="text-xl text-destructive">Nessun ordine per oggi</h2>
            )}

            {list.length > 0 && (
                <section className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
                    {list.map((el) => {

                        const total = getTotal(el.order, el.type)
                        const commission = getServicePrice(el.order)

                        return (
                            <section
                                key={el._id}
                                className="bg-card text-card-foreground flex flex-col gap-4 rounded-xl border p-4 shadow-sm"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-xl text-primary">({el.code}) {el.fullname}</h2>
                                    <h4 className="text-sm">{el.date} | {el.time}</h4>
                                    <h4 className="text-sm">{el.phone}</h4>
                                </div>
                                <Separator />


                                {el.type == "domicile" && (
                                    <Accordion type="single" collapsible>
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger className="py-0 text-muted-foreground">
                                                <span className="flex items-center gap-2">
                                                    <Bike className="size-4" />
                                                    Domicilio
                                                </span>
                                            </AccordionTrigger>
                                            <AccordionContent className="space-y-4 mt-4 pb-0">
                                                <p>Indirizzo: <strong>{el.address?.street}</strong></p>
                                                <p>Numero civico: <strong>{el.address?.street_number}</strong></p>
                                                <p>Città: <strong>{el.address?.city}</strong></p>
                                                <p>Cap: <strong>{el.address?.cap}</strong></p>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                )}
                                {el.type == "take_away" && (
                                    <p className="text-muted-foreground text-sm flex items-center gap-2">
                                        <House className="size-4" />
                                        Asporto
                                    </p>
                                )}
                                <Separator />


                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="py-0 text-muted-foreground">
                                            <span className="flex items-center gap-2">
                                                <Pizza className="size-4" />
                                                Ordine
                                            </span>
                                        </AccordionTrigger>
                                        <AccordionContent className="space-y-4 mt-4 pb-0">
                                            {el.order.map((order, i) => (
                                                <div key={i} className="p-4 bg-slate-100 rounded-md space-y-2">
                                                    <div>
                                                        <p className="text-lg mb-1">{order.name} x {order.quantity}</p>
                                                        <p>Tipologia: <strong>{order.type}</strong></p>
                                                    </div>
                                                    {order.custom && order.custom?.length > 0 && (
                                                        <>
                                                            <Separator />
                                                            {order.custom.map((custom, i) => (
                                                                <p key={i} className="flex items-center gap-2 text-xs">
                                                                    <Plus className="size-4 text-green-600" />
                                                                    {custom.name}
                                                                </p>
                                                            ))}
                                                        </>
                                                    )}
                                                    <Separator />
                                                    <p className="flex items-center gap-2 justify-between">
                                                        <span>Prezzo:</span>
                                                        <strong>{(parseFloat(order.price) * order.quantity).toFixed(2).toString()}€</strong>
                                                    </p>
                                                    {order.custom && order.custom?.length > 0 && (
                                                        <>
                                                            {order.custom.map((custom, i) => (
                                                                <p key={i} className="flex items-center gap-2 justify-between">
                                                                    {custom.name}
                                                                    <strong>{(parseFloat(custom.price) * order.quantity).toFixed(2).toString()}€</strong>
                                                                </p>
                                                            ))}
                                                        </>
                                                    )}
                                                    <p className="flex items-center gap-2 justify-between">
                                                        <span>Totale: </span>
                                                        <strong>{order.total}€</strong>
                                                    </p>
                                                </div>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                                <Separator />
                                <p className="text-muted-foreground text-sm flex items-center justify-between gap-2">
                                    <span className="flex items-center gap-2">
                                        <BadgeEuro className="size-4" />
                                        Spedizione:
                                    </span>
                                    <strong>{el.type == "domicile" ? shipping : "0.00"}€</strong>
                                </p>
                                <p className="text-muted-foreground text-sm flex items-center justify-between gap-2">
                                    <span className="flex items-center gap-2">
                                        <BadgeEuro className="size-4" />
                                        Commissioni:
                                    </span>
                                    <strong>{commission}€</strong>
                                </p>
                                <p className="text-muted-foreground text-sm flex items-center justify-between gap-2">
                                    <span className="flex items-center gap-2">
                                        <BadgeEuro className="size-4" />
                                        Totale:
                                    </span>
                                    <strong className="text-primary">{total}€</strong>
                                </p>
                                <Separator />
                                <div className={`${el.pay == "home" ? "bg-primary" : "bg-green-600"} rounded-md p-2 text-white text-center`}>
                                    {el.pay == "home" ? "Pagamento alla consegna" : "Pagamento online"}
                                </div>
                            </section>
                        )
                    })}
                </section>
            )}
        </>
    )
}