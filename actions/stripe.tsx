'use server'

// stripe
import Stripe from 'stripe'

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// init
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// create payment
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function createPaymentIntent(total: number) {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100),
        currency: 'eur',
        payment_method_types: ['card']
    })

    return paymentIntent.client_secret
}


// Impostazioni > Payments > disabilitare Link