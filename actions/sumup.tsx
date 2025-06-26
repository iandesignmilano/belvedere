"use server"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// token
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

async function getSumupToken() {
    const clientId = process.env.SUMUP_CLIENT_ID!
    const clientSecret = process.env.SUMUP_CLIENT_SECRET!

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

export async function createSumupCheckout({ amount, description, }: { amount: number, description: string }) {
    const token = await getSumupToken()

    const res = await fetch("https://api.sumup.com/v0.1/checkouts", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            amount: amount.toFixed(2),
            currency: "EUR",
            checkout_reference: `order_${Date.now()}`,
            description,
            return_url: "https://tuosito.com/success"
        }),
    })

    const data = await res.json()
    console.log(data)
    return data.checkout_url as string
}