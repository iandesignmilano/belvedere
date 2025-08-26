"use client"

import React, { useState, useEffect } from "react"

// components
import OrderPdf from "./OrderPdf"
import SearchOrders from "./SearchOrders"
import DateOrders from "./DateOrders"

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

export default function OrderList({ orders, privileges }: { orders: OrdersProps[], privileges: string }) {

    // socket
    const { updateData, setUpdateData } = useSocket()

    // shipping cost
    const shipping = "9.00"

    // search
    const [search, setSearch] = useState("")

    // date
    const [dt, setDt] = useState("")

    // data
    const [list, setList] = useState<OrdersProps[]>(orders)

    // --------------------------------------------------------------
    // colors
    // --------------------------------------------------------------

    const colors = {
        Z1: "bg-orange-500",
        Z2: "bg-emerald-500",
        Z3: "bg-indigo-500",
        Z4: "bg-rose-500"
    }

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
    // update data
    // --------------------------------------------------------------

    useEffect(() => {
        const run = async () => {
            let base = orders

            if (dt) {
                const data = await getOrders(dt)
                base = data
            }

            if (search) {
                const s = search.toLowerCase()
                base = base.filter(el => el.code.toLowerCase().includes(s) || el.fullname.toLowerCase().includes(s))
            }

            setList(base)
        }

        run()
    }, [orders, dt, search])

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
            <div className="grid lg:grid-cols-3 gap-4">
                <div>
                    <DateOrders dt={dt} setDt={setDt} />
                </div>
                <div>
                    <SearchOrders search={search} setSearch={setSearch} />
                </div>
                {(privileges == "all" || privileges.includes("create")) && (
                    <div>
                        <Button className="custom-button w-full" disabled>
                            Aggiungi ordine
                        </Button>
                    </div>
                )}
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
                                            <span className="flex max-lg:flex-col lg:items-center gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Badge>
                                                        {el.type == "domicile" ? <Bike /> : <House />}
                                                        {el.time}
                                                    </Badge>
                                                    {el.type == "domicile" && (
                                                        <Badge className={colors[el.address?.zone as keyof typeof colors]}>
                                                            {el.address?.zone}
                                                        </Badge>
                                                    )}
                                                </div>
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
                                                                        <span>
                                                                            - {(parseFloat(order.type == "xl" ? custom.xl : order.type == "xxl" ? custom.xxl : custom.price) * order.quantity).toFixed(2).toString()}€
                                                                        </span>
                                                                    </p>
                                                                ))}

                                                                {order.custom && order.custom?.length > 0 && order.custom.map((custom, i) => (
                                                                    <p key={i} className="flex items-center gap-2 justify-between text-sm text-primary">
                                                                        <span>{custom.name}</span>
                                                                        <span>
                                                                            + {(parseFloat(order.type == "xl" ? custom.xl : order.type == "xxl" ? custom.xxl : custom.price) * order.quantity).toFixed(2).toString()}€
                                                                        </span>
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
                                            onClick={() => OrderPdf(el, "kitchen")}
                                            className="rounded-full max-lg:grow custom-button !text-sm"
                                        >
                                            <Printer />
                                        </Button>
                                        {el.type == "domicile" && (
                                            <Button
                                                onClick={() => OrderPdf(el, "delivery")}
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