"use server"

// lib
import { generateCode } from "@/lib/code"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// token
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

async function getSumupToken() {
    const clientId = process.env.SUMUP_PUBLIC_ID!
    const clientSecret = process.env.SUMUP_SECRET_ID!

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

    const res = await fetch("https://api.sumup.com/token", {
        method: "POST",
        headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            grant_type: "client_credentials",
            scope: "payments"
        })
    })

    const data = await res.json()
    return data.access_token as string
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// pay
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function createSumupCheckout({ amount, description, }: { amount: string, description: string }) {
    const token = await getSumupToken()
    const code = process.env.SUMUP_MERCHANT_CODE!

    const gen_code = generateCode()
    const transition_code = `order_${Date.now()}_${gen_code}`

    const res = await fetch("https://api.sumup.com/v0.1/checkouts", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            checkout_reference: transition_code,
            amount: amount,
            currency: "EUR",
            merchant_code: code,
            description,
            hosted_checkout: { enabled: true },
            redirect_url: `http://localhost:3000/ordina`
        }),
    })

    const data = await res.json()
    return {
        url: data.hosted_checkout_url,
        id: data.id
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// pay status
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function SumupCheckoutStatus(transition_code: string) {
    const token = await getSumupToken()

    const res = await fetch(`https://api.sumup.com/v0.1/checkouts/${transition_code}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    })

    const data = await res.json()
    return data.status
}