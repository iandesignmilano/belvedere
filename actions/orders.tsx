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

type AddressProps = {
    street: string
    street_number: string
    city: string
    cap: string
}

export type ItemsProps = {
    id: string
    name: string
    ingredients: string
    type: string
    price: string
    quantity: number
    custom: {
        name: string
        price: string
    }[] | null
    total: string
}

type OrderBase = {
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

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// get orders
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getOrders() {

    const today = format(new Date(), "dd-MM-yyyy")

    const orders = await db
        .collection("orders")
        .find({ date: today })
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
// get orders by date
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getOrdersByDate(date: string) {

    const orders = await db
        .collection("orders")
        .find({ date: date })
        .sort({ time: 1 })
        .toArray()

    const result = orders.map((el) => ({
        _id: el._id.toString(),
        code: el.code,
        fullname: el.fullname,
        phone: el.phone,
        date: el.date,
        time: el.time,
        type: el.type,
        address: el.address,
        pay: el.pay,
        order: el.order
    }))

    return result
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// add reservations
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
        from: "Website <website@iandesign.it>",
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
                    <p>${order.ingredients}</p>
                    ${order.custom && order.custom?.length > 0 && `
                        <hr />
                        ${order.custom.map((custom) => `<p key={i} className="text-sm"> + ${custom.name} ${custom.price}€</p>`)}
                    `}
                    <hr />
                    <p><strong>Tipologia:</strong> ${order.type}</p>
                    <p><strong>Prezzo:</strong> ${order.price}€</p>
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
    catch { return { errors: "Si è verificato un errore, riprova più tardi" } }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// delete reservations
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function deleteOrderAction(id: string): Promise<{ success: boolean }> {
    const _id = new ObjectId(id)
    const result = await db.collection("orders").deleteOne({ _id: _id })
    if (result.deletedCount === 0) return { success: false }
    revalidatePath("/private/ordini")
    return { success: true }
}