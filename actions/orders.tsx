"use server"

// next
import { revalidatePath } from 'next/cache'

// db
import { db } from '@/lib/db'

// interface
import { ObjectId } from 'mongodb'

// email
import nodemailer from "nodemailer"

// date
import { format } from "date-fns"

// lib
import { verifyAuth } from '@/lib/session'
import { generateCode } from '@/lib/code'
import { roundToNext10Min } from '@/lib/time'

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// conf
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const configOptions = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.IANDESIGN_USER,
        pass: process.env.IANDESIGN_PASS
    }
}

const transporter = nodemailer.createTransport(configOptions)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export type AddressProps = {
    street: string
    street_number: string
    city: string
    cap: string
}

export interface Ingredient {
    name: string
    price: string
    xl: string
}

export type ItemsProps = {
    id: string | number
    name: string
    ingredients: Ingredient[]
    type: string
    type_list: string
    price: string
    quantity: number
    removed: Ingredient[] | null
    custom: Ingredient[] | null
    total: string
}

export type OrderBase = {
    type: string
    address?: AddressProps
    date: string
    time: string
    fullname: string
    email: string
    phone: string
    pay: string
    pay_id: string
    order: ItemsProps[]
}

export interface OrdersProps extends OrderBase {
    _id: string
    code: string
}

type AddOrderProps = OrderBase


interface BakingProps {
    date: string
    orders: {
        type: string
        quantity: number
    }[]
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// get
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getOrders(date?: string) {

    const dt = date ? date : format(new Date(), "dd-MM-yyyy")

    const orders = await db
        .collection("orders")
        .find({ date: dt })
        .sort({ time: 1 })
        .toArray()

    const result = orders.map((el) => ({
        _id: el._id.toString(),
        code: el.code,
        fullname: el.fullname,
        phone: el.phone,
        email: el.email,
        date: el.date,
        time: el.time,
        type: el.type,
        address: el.address,
        pay: el.pay,
        pay_id: el.pay_id,
        order: el.order
    }))

    return result
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// add
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function addOrderAction(formData: AddOrderProps, user?: string) {

    // today
    const today = format(new Date(), "dd-MM-yyyy")

    // check
    let check_user = false
    const auth = await verifyAuth()
    if (auth.user?.id && user && auth.user.id == user) check_user = true

    // data
    const code = generateCode()
    const order = { ...formData, code }

    // message
    const message = {
        from: "Pizzeria Belvedere <pizzeriabelvederesenago2000@gmail.com>",
        to: formData.email,
        subject: "Ordine effettuato con successo!",
        html: (`
            <p><strong>Codice prenotazione:</strong> ${code}</p>
            <hr />
            <p><strong>Data:</strong> ${formData.date}</p>
            <p><strong>Orario:</strong> ${formData.time}</p>
            <p><strong>Consegna:</strong> ${formData.type == "domicile" ? "Domicilio" : "Asporto"}</p>
            <hr />
            ${formData.type == "domicile" ? (`
                <p><strong>Indirizzo:</strong> ${formData.address?.street}</p>
                <p><strong>Numero civico:</strong> ${formData.address?.street_number}</p>
                <p><strong>Città:</strong> ${formData.address?.city}</p>
                <p><strong>Cap:</strong> ${formData.address?.cap}</p>
                <hr />
            `) : ""}
            <p><strong>Nome e cognome:</strong> ${formData.fullname}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Telefono:</strong> ${formData.phone}</p>
            <p><strong>Pagamento:</strong> ${formData.pay == "home" ? "Pagamento alla consegna" : "Pagamento online"}</p>
            <hr />
            <p><strong>Ordine:</strong></p>
            ${formData.order.map((order) => `
                <div style="background:#f1f5f9; padding:1rem; margin-bottom:1rem; border-radius:8px;">
                    <p>${order.name}</p>

                    ${order.ingredients && order.ingredients.length > 0 ? `<p>${order.ingredients.map(ing => ing.name).join(", ")}</p>` : ""}

                    <hr />

                    ${order.type_list == "pizze" ? `<p><strong>Tipologia:</strong> ${order.type}</p>` : ""}

                    <p><strong>Prezzo:</strong> ${order.price}€</p>

                    ${order.removed && order.removed?.length > 0 ? `
                        ${order.removed.map((custom) => `<p> - ${custom.name} ${order.type == "base" ? custom.price : custom.xl}€</p>`).join('')}
                    ` : ""}

                    ${order.custom && order.custom?.length > 0 ? `
                        ${order.custom.map((custom) => `<p> + ${custom.name} ${order.type == "base" ? custom.price : custom.xl}€</p>`).join('')}
                    ` : ""}

                    <p><strong>Quantità:</strong> ${order.quantity}</p>
                    <p><strong>Totale:</strong> ${order.total}€</p>
                </div>
            `).join("")}
        `)
    }

    try {
        await db.collection("orders").insertOne(order)

        // not user request and date is today
        if (!check_user && formData.date == today) {
            await fetch(process.env.NEXT_PUBLIC_WS_API_URL as string, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Nuovo ordine' })
            })
        }

        await transporter.verify()
        await transporter.sendMail(message)

        revalidatePath("/private/ordini")
        return { success: true }
    }
    catch (err) { console.log(err); return { errors: "Si è verificato un errore, riprova più tardi" } }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// delete
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function deleteOrderAction(id: string): Promise<{ success: boolean }> {
    const _id = new ObjectId(id)
    const result = await db.collection("orders").deleteOne({ _id: _id })
    if (result.deletedCount === 0) return { success: false }
    revalidatePath("/private/ordini")
    return { success: true }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// free time
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const UNITS_BASE = 2
const UNITS_XL = 3
const UNITS_TOTAL = 96 // 8 teglie

// porzioni
function getUnitsFromOrders(orders: BakingProps['orders']): number {
    return orders.reduce((total, order) => {
        if (order.type === 'base') return total + order.quantity * UNITS_BASE
        if (order.type === 'abbondante') return total + order.quantity * UNITS_XL
        return total
    }, 0)
}

// slot tempo (19 - 21) ogni 10 min
function generateSlots(): string[] {
    const slots: string[] = []
    let hour = 19
    let minute = 0

    for (let i = 0; i < 13; i++) {
        slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`)
        minute += 10
        if (minute >= 60) {
            hour++
            minute = 0
        }
    }

    return slots
}

export async function getBakingFree({ date, orders }: BakingProps) {

    // unità e slot
    const orderUnits = getUnitsFromOrders(orders)
    const slots = generateSlots()

    // tutti gli ordini
    const allOrders = await db
        .collection("orders")
        .find({ date: date })
        .sort({ time: 1 })
        .toArray()

    // suddido gli ordini negli slot
    const existingOrdersBySlot: Record<string, BakingProps['orders']> = {}

    for (const order of allOrders) {
        if (!existingOrdersBySlot[order.time]) existingOrdersBySlot[order.time] = []
        existingOrdersBySlot[order.time].push(...order.orders)
    }

    // slot disponibili
    const availableSlots: string[] = []

    for (const slot of slots) {
        const existingOrders = existingOrdersBySlot[slot] || []
        const usedUnits = getUnitsFromOrders(existingOrders)
        if (usedUnits + orderUnits <= UNITS_TOTAL) availableSlots.push(slot)
    }

    return availableSlots
}