"use client"

import React, { useState, useEffect, useCallback } from "react"

// shad
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// icons
import { CreditCard, House, Loader2 } from "lucide-react"

// stripe
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"

// action
import { createPaymentIntent } from "@/actions/stripe"

// components
import { ToastDanger } from "../../Toast"

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
        ingredients: string
        type: string
        price: string
        quantity: number
        custom: { name: string; price: string; }[]
        total: string;
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
// stripe init
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Step5({ values, progress, setProgress, setFieldValue, submitForm, isSubmitting }: Step5Props) {

    const type_name: Record<string, string> = { take_away: "Asporto", domicile: "Domicilio" }

    const shipping = "9.00"

    // --------------------------------------------------------------
    // total
    // --------------------------------------------------------------

    const getTotal = useCallback(() => {
        const totalOrderPrice = values.order.reduce((sum, order) => sum + parseFloat(order.total), 0)
        const commission = totalOrderPrice * 0.015 + 0.25
        const totalPartial = (totalOrderPrice + commission + 2).toFixed(2).toString()
        const total = (parseFloat(totalPartial) + parseFloat(shipping)).toFixed(2).toString()
        return values.type == "domicile" ? total : totalPartial
    }, [values.order, values.type])


    const getServicePrice = useCallback(() => {
        const totalOrderPrice = values.order.reduce((sum, order) => sum + parseFloat(order.total), 0)
        const commission = totalOrderPrice * 0.015 + 0.25
        return (commission + 2).toFixed(2).toString()
    }, [values.order])

    // --------------------------------------------------------------
    // pay
    // --------------------------------------------------------------

    const [clientSecret, setClientSecret] = useState<string | null>(null)

    useEffect(() => {
        if (values.pay === "card" && clientSecret === null) {
            createPaymentIntent(parseFloat(getTotal()))
                .then(secret => setClientSecret(secret))
                .catch(() => ToastDanger())
        }
    }, [values.pay, getTotal, clientSecret])

    // --------------------------------------------------------------
    // order
    // --------------------------------------------------------------

    async function sendOrder() { await submitForm() }

    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------

    function StripeForm() {

        const [sendPay, setSendPay] = useState(false)

        const stripe = useStripe()
        const elements = useElements()

        const payOrder = async () => {
            if (!stripe || !elements) return
            setSendPay(true)
            const result = await stripe.confirmPayment({ elements, redirect: "if_required" })

            if (result.error) {
                ToastDanger()
                setSendPay(false)
            }

            else {
                setFieldValue("pay_id", result.paymentIntent.id, false)
                await new Promise(resolve => setTimeout(resolve, 10))
                await submitForm()
                setSendPay(false)
            }
        }

        return (
            <>
                {stripe && elements && values.pay === 'card' && < PaymentElement />}
                <div className="lg:col-span-2 flex max-lg:flex-col-reverse gap-4 justify-between">
                    <Button
                        disabled={isSubmitting || sendPay}
                        className="custom-button custom-button-outline !text-lg"
                        variant="outline"
                        type="button"
                        onClick={() => setProgress(progress - 1)}
                    >
                        Indietro
                    </Button>
                    <Button
                        onClick={payOrder}
                        type="button"
                        disabled={!values.pay || isSubmitting || sendPay}
                        className="custom-button !text-lg max-lg:grow bg-green-600 hover:bg-green-600/90"
                    >
                        {isSubmitting || sendPay && <Loader2 className="size-6 animate-spin" />}
                        Paga ordine
                    </Button>
                </div>
            </>
        )
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
                                        <span>Prezzo:</span>
                                        <span>{parzial}€</span>
                                    </p>
                                    {el.custom && el.custom.map((add, i) => (
                                        <p key={i} className="text-sm flex items-center justify-between gap-2">
                                            <span>{add.name}</span>
                                            <span>{(parseFloat(add.price) * el.quantity).toFixed(2).toString()}€</span>
                                        </p>
                                    ))}
                                    <p className="text-sm flex items-center justify-between gap-2">
                                        <span>Totale:</span>
                                        <span>{el.total}€</span>
                                    </p>
                                </div>
                                <Separator className="my-2" />
                            </React.Fragment>
                        )
                    })}
                    <div className="space-y-2">
                        {values.type == "domicile" && (
                            <p className="text-sm flex items-center justify-between gap-2">
                                <span>Spedizione:</span>
                                <span>{shipping}€</span>
                            </p>
                        )}
                        <p className="text-sm flex items-center justify-between gap-2">
                            <span>Commissioni:</span>
                            <span>{getServicePrice()}€</span>
                        </p>
                        <Separator className="my-2" />
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

            {values.pay === "card" && clientSecret && (
                <div className="lg:col-span-2 space-y-4">
                    <Elements options={{ clientSecret }} stripe={stripePromise}>
                        <StripeForm />
                    </Elements>
                </div>
            )}

            {values.pay == "home" && (
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
                    <Button
                        onClick={sendOrder}
                        type="button"
                        disabled={!values.pay || isSubmitting}
                        className="custom-button !text-lg max-lg:grow bg-green-600 hover:bg-green-600/90"
                    >
                        {isSubmitting && <Loader2 className="size-6 animate-spin" />}
                        Conferma ordine
                    </Button>
                </div>
            )}
        </>
    )
}