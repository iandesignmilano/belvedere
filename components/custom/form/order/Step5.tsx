"use client"

import React, { useCallback } from "react"

// shad
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// icons
import { CreditCard, House, Loader2 } from "lucide-react"

// action
// import { createSumupCheckout } from "@/actions/sumup"

// interface
import { Ingredient } from "./Step1"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export type initialValue = {

    type: string
    address: {
        street?: string
        street_number?: string
        city?: string
        cap?: string
    }

    date: string | undefined
    time: string

    order: {
        id: number
        name: string
        ingredients: Ingredient[]
        type: string
        price: string
        quantity: number
        removed: Ingredient[]
        custom: Ingredient[]
        total: string
    }[];

    pay: string
    pay_id: string
}

interface Step5Props {
    values: initialValue
    setFieldValue: <K extends keyof initialValue>(field: K, value: initialValue[K], shouldValidate?: boolean) => void
    setProgress: React.Dispatch<React.SetStateAction<number>>
    progress: number
    isSubmitting: boolean
    submitForm: () => Promise<void>
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Step5({ values, progress, setProgress, setFieldValue, submitForm, isSubmitting }: Step5Props) {

    const type_name: Record<string, string> = { take_away: "Asporto", domicile: "Domicilio" }

    const shipping = "3.00"

    // --------------------------------------------------------------
    // total
    // --------------------------------------------------------------

    const getTotal = useCallback(() => {
        const totalOrderPrice = values.order.reduce((sum, order) => sum + parseFloat(order.total), 0)
        const total = (totalOrderPrice + parseFloat(shipping)).toFixed(2).toString()
        return values.type == "domicile" ? total : totalOrderPrice.toFixed(2).toString()
    }, [values.order, values.type])

    // --------------------------------------------------------------
    // order
    // --------------------------------------------------------------

    async function sendOrder() {
        await submitForm()
        // const url = await createSumupCheckout({ amount: 15.5, description: "Pizza Belvedere" })
        // console.log(url)
    }

    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------

    return (
        <>

            <div className="lg:col-span-2 bg-slate-100 p-4 rounded-md">
                <div className="space-y-2">
                    <p className="text-sm">Data: {values.date}</p>
                    <p className="text-sm">Ora: {values.time}</p>
                    <Separator />
                    <p className="text-sm">Consegna: {type_name[values.type]}</p>
                    {values.type == "domicile" && (
                        <>
                            <p className="text-sm">Indirizzo: {values.address.street}, {values.address.street_number}</p>
                            <p className="text-sm">Città: {values.address.city} ({values.address.cap})</p>
                        </>
                    )}
                </div>
            </div>

            <div className="lg:col-span-2 bg-slate-100 p-4 rounded-md">
                <div>
                    {values.order.map((el, i) => {

                        const parzial = (parseFloat(el.price) * el.quantity).toFixed(2).toString()

                        return (
                            <React.Fragment key={i}>
                                <div className="space-y-2">
                                    <h4>{el.name} x {el.quantity}</h4>
                                    <p className="text-sm flex items-center justify-between gap-2">
                                        <span>Prezzo</span>
                                        <span>{parzial}€</span>
                                    </p>
                                    {el.removed && el.removed.map((add, i) => (
                                        <p key={i} className="text-sm flex items-center justify-between gap-2">
                                            <span>{add.name}</span>
                                            <span className="text-destructive">- {(parseFloat(el.type == "base" ? add.price : add.xl) * el.quantity).toFixed(2).toString()}€</span>
                                        </p>
                                    ))}
                                    {el.custom && el.custom.map((add, i) => (
                                        <p key={i} className="text-sm flex items-center justify-between gap-2">
                                            <span>{add.name}</span>
                                            <span className="text-primary">+ {(parseFloat(el.type == "base" ? add.price : add.xl) * el.quantity).toFixed(2).toString()}€</span>
                                        </p>
                                    ))}
                                    <p className="text-sm flex items-center justify-between gap-2 font-bold">
                                        <span>Totale</span>
                                        <span>{el.total}€</span>
                                    </p>
                                </div>
                                <Separator className="my-2" />
                            </React.Fragment>
                        )
                    })}
                    <div className="space-y-2">
                        {values.type == "domicile" && (
                            <>
                                <p className="text-sm flex items-center justify-between gap-2">
                                    <span>Spedizione:</span>
                                    <span>{shipping}€</span>
                                </p>
                                <Separator className="my-2" />
                            </>
                        )}
                        <p className="text-lg font-bold flex items-center justify-between gap-2">
                            <span>Totale:</span>
                            <span>{getTotal()}€</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                <div
                    className={`custom-form-box ${values.pay == "home" && "custom-form-box-active"}`}
                    onClick={() => setFieldValue("pay", "home")}
                >
                    <House className="size-8" />
                    <span>Alla consegna</span>
                </div>
                <div
                    className={`custom-form-box ${values.pay == "card" && "custom-form-box-active"}`}
                    onClick={() => setFieldValue("pay", "card")}
                >
                    <CreditCard className="size-8" />
                    <span>Carta</span>
                </div>
            </div>

            <div className="lg:col-span-2 flex max-lg:flex-col-reverse gap-4 justify-between">
                <Button
                    className="custom-button custom-button-outline !text-lg"
                    variant="outline"
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setProgress(progress - 1)}
                >
                    Indietro
                </Button>

                {values.pay == "home" && (
                    <Button
                        onClick={sendOrder}
                        type="button"
                        disabled={!values.pay || isSubmitting}
                        className="custom-button !text-lg max-lg:grow bg-green-600 hover:bg-green-600/90"
                    >
                        {isSubmitting && <Loader2 className="size-6 animate-spin" />}
                        Conferma ordine
                    </Button>
                )}

                {values.pay === "card" && (
                    <Button
                        onClick={sendOrder}
                        type="button"
                        disabled={!values.pay || isSubmitting}
                        className="custom-button !text-lg max-lg:grow bg-green-600 hover:bg-green-600/90"
                    >
                        {isSubmitting && <Loader2 className="size-6 animate-spin" />}
                        Paga ordine
                    </Button>
                )}
            </div>

        </>
    )
}