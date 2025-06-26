"use client"

import React, { useState, useEffect } from "react"

// components
import OrderPdf from "./OrderPdf"

// shad
import { Badge } from "@/components/ui/badge"
import { Separator } from "../../ui/separator"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// actions and hook
import { getOrders, OrdersProps, ItemsProps } from "@/actions/orders"
import { useSocket } from "@/components/custom/Socket"

// icons
import { House, Bike, Pizza, BadgeEuro, Calendar, Phone, Printer, Banknote, CreditCard } from "lucide-react"

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
        const total = (totalOrderPrice + parseFloat(shipping)).toFixed(2).toString()
        return type == "domicile" ? total : totalOrderPrice.toFixed(2).toString()
    }

    const getPrice = (order: ItemsProps[]) => {
        const totalOrderPrice = order.reduce((sum, order) => sum + parseFloat(order.total), 0)
        return totalOrderPrice.toFixed(2).toString()
    }

    // --------------------------------------------------------------
    // data
    // --------------------------------------------------------------

    const [list, setList] = useState<OrdersProps[]>(orders)
    useEffect(() => { setList(orders) }, [orders])

    // --------------------------------------------------------------
    // pdf height
    // --------------------------------------------------------------

    const getHeight = (len: number): number => {
        let h = 20
        if (len == 5) h = 30
        if (len > 7) h = 40
        if (len > 9) h = 50
        return h
    }

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
                <section>
                    {list.map((el, i) => {

                        const total = getTotal(el.order, el.type)
                        const price = getPrice(el.order)

                        return (
                            <section key={el._id} className="mb-4">
                                <Accordion type="single" collapsible>
                                    <AccordionItem value={`item-${i}`}>
                                        <AccordionTrigger className="bg-slate-100 flex items-center justify-between p-4 rounded-b-none cursor-pointer hover:no-underline">
                                            <span className="flex items-center gap-2">
                                                <Badge>{el.time}</Badge>
                                                <h2 className="text-sm text-primary">({el.code}) {el.fullname}</h2>
                                            </span>
                                        </AccordionTrigger>
                                        <AccordionContent className="space-y-4 p-4 pt-0 bg-slate-100">
                                            <Separator />
                                            <h4 className={`text-base flex items-center font-bold gap-2 ${el.pay == "home" ? "text-primary" : "text-green-600"}`}>
                                                {el.pay == "home" ? <Banknote className="size-5" /> : <CreditCard className="size-5" />}
                                                {el.pay == "home" ? "Pagamento alla consegna" : "Pagato online con carta"}
                                            </h4>
                                            <Separator />
                                            <h4 className="text-sm flex items-center gap-2">
                                                <Calendar className="size-4" />
                                                {el.date} | {el.time}
                                            </h4>
                                            <h4 className="text-sm flex items-center gap-2">
                                                <Phone className="size-4" />
                                                {el.phone}
                                            </h4>
                                            <Separator />

                                            {el.type == "domicile" && (
                                                <Accordion type="single" collapsible>
                                                    <AccordionItem value="item-1">
                                                        <AccordionTrigger className="py-0 text-black cursor-pointer hover:no-underline">
                                                            <span className="flex items-center gap-2">
                                                                <Bike className="size-4" />
                                                                Domicilio
                                                            </span>
                                                        </AccordionTrigger>
                                                        <AccordionContent className="space-y-4 mt-4 pb-0">
                                                            <div className="p-4 bg-slate-200 rounded-md space-y-3">
                                                                <p className="flex gap-2 items-center justify-between">
                                                                    <span>Indirizzo</span>
                                                                    <strong>{el.address?.street}, {el.address?.street_number}</strong>
                                                                </p>
                                                                <p className="flex gap-2 items-center justify-between">
                                                                    <span>Città</span>
                                                                    <span>{el.address?.city} ({el.address?.cap})</span>
                                                                </p>
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </Accordion>
                                            )}
                                            {el.type == "take_away" && (
                                                <p className="text-black text-sm flex items-center gap-2">
                                                    <House className="size-4" />
                                                    Asporto
                                                </p>
                                            )}
                                            <Separator />

                                            <Accordion type="single" collapsible>
                                                <AccordionItem value="item-1">
                                                    <AccordionTrigger className="py-0 text-black cursor-pointer hover:no-underline">
                                                        <span className="flex items-center gap-2">
                                                            <Pizza className="size-4" />
                                                            Ordine
                                                        </span>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="space-y-4 mt-4 pb-0">
                                                        {el.order.map((order, i) => (
                                                            <div key={i} className="p-4 bg-slate-200 rounded-md space-y-3">
                                                                <div>
                                                                    <p className="text-base">
                                                                        {order.quantity} X {order.name} {order.type_list == "pizze" && `- ${order.type.toUpperCase()}`}
                                                                    </p>
                                                                    {order.ingredients && order.ingredients.length > 0 && (
                                                                        <p className="text-xs">
                                                                            {order.ingredients.map(ing => ing.name).join(", ")}
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                {(parseFloat(order.price) * order.quantity).toFixed(2).toString() !== order.total && (
                                                                    <p className="flex items-center gap-2 justify-between text-sm">
                                                                        <span>Prezzo</span>
                                                                        <span>{(parseFloat(order.price) * order.quantity).toFixed(2).toString()}€</span>
                                                                    </p>
                                                                )}

                                                                {order.removed && order.removed?.length > 0 && order.removed.map((custom, i) => (
                                                                    <p key={i} className="flex items-center gap-2 justify-between text-sm text-destructive">
                                                                        <span>{custom.name}</span>
                                                                        <span> - {(parseFloat(order.type == "base" ? custom.price : custom.xl) * order.quantity).toFixed(2).toString()}€</span>
                                                                    </p>
                                                                ))}

                                                                {order.custom && order.custom?.length > 0 && order.custom.map((custom, i) => (
                                                                    <p key={i} className="flex items-center gap-2 justify-between text-sm text-primary">
                                                                        <span>{custom.name}</span>
                                                                        <span> + {(parseFloat(order.type == "base" ? custom.price : custom.xl) * order.quantity).toFixed(2).toString()}€</span>
                                                                    </p>
                                                                ))}

                                                                <p className="flex items-center gap-2 justify-between text-base font-bold">
                                                                    <span>Totale</span>
                                                                    <span>{order.total}€</span>
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                            <Separator />

                                            <Accordion type="single" collapsible>
                                                <AccordionItem value="item-1">
                                                    <AccordionTrigger className="py-0 text-black cursor-pointer hover:no-underline">
                                                        <span className="flex items-center gap-2">
                                                            <BadgeEuro className="size-4" />
                                                            Costi
                                                        </span>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="space-y-4 mt-4 pb-0">
                                                        <div className="p-4 bg-slate-200 rounded-md space-y-3">
                                                            <p className="flex items-center gap-2 justify-between text-sm">
                                                                <span>Prezzo</span>
                                                                <span>{price}€</span>
                                                            </p>
                                                            <p className="flex items-center gap-2 justify-between text-sm">
                                                                <span>Spedizione</span>
                                                                <span>{el.type == "domicile" ? shipping : "0.00"}€</span>
                                                            </p>
                                                            <p className="flex items-center gap-2 justify-between text-base font-bold">
                                                                <span>Totale</span>
                                                                <span>{total}€</span>
                                                            </p>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                                <section className="rounded-b-md bg-slate-100 p-4 pt-0">
                                    <Separator className="mb-4" />
                                    <div className="flex gap-2 items-center justify-end">
                                        <Button
                                            onClick={() => OrderPdf(el, getHeight(el.order.length), "kitchen")}
                                            className="rounded-full max-lg:grow custom-button !text-sm"
                                        >
                                            <Printer />
                                        </Button>
                                        {el.type == "domicile" && (
                                            <Button
                                                onClick={() => OrderPdf(el, getHeight(el.order.length), "delivery")}
                                                className="bg-cyan-600 hover:bg-cyan-600/90 rounded-full max-lg:grow custom-button !text-sm"
                                            >
                                                <Bike />
                                            </Button>
                                        )}
                                    </div>
                                </section>
                            </section>
                        )
                    })}
                </section>
            )}
        </>
    )
}