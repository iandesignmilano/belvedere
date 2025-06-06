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

export type ReservationsProps = {
    _id: string
    code: string
    fullname: string
    email: string
    phone: string
    people: number
    date: string
    time: string
}

export type AddProps = {
    fullname: string
    email: string
    phone: string
    people: number
    date: string
    time: string
}

type UpdateProps = {
    people: number
    date: string
    time: string
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// get reservations
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getReservations() {

    const today = format(new Date(), "dd-MM-yyyy")

    const reservations = await db
        .collection("reservations")
        .find({ date: today })
        .sort({ time: 1 })
        .toArray()

    const result = reservations.map((el) => ({
        _id: el._id.toString(),
        fullname: el.fullname,
        email: el.email,
        phone: el.phone,
        people: el.people,
        date: el.date,
        time: el.time,
        code: el.code
    }))

    return result
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// get reservations by date
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getReservationsByDate(date: string) {

    const reservations = await db
        .collection("reservations")
        .find({ date: date })
        .sort({ time: 1 })
        .toArray()

    const result = reservations.map((el) => ({
        _id: el._id.toString(),
        fullname: el.fullname,
        email: el.email,
        phone: el.phone,
        people: el.people,
        date: el.date,
        time: el.time,
        code: el.code
    }))

    return result
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// get reservation
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getReservation(id: string) {
    const _id = new ObjectId(id)
    const reservation = await db.collection("reservations").findOne({ _id })
    if (!reservation) return null
    return {
        _id: reservation._id.toString(),
        fullname: reservation.fullname,
        email: reservation.email,
        phone: reservation.phone,
        people: reservation.people,
        date: reservation.date,
        time: reservation.time,
        code: reservation.code
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// add reservations
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function addReservationAction(formData: AddProps, user?: string) {

    // today
    const today = format(new Date(), "dd-MM-yyyy")

    // check
    let check_user = false
    const auth = await verifyAuth()
    if (auth.user?.id && user && auth.user.id == user) check_user = true

    // data
    const { fullname, email, phone, people, date, time } = formData
    const code = generateCode()
    const reservation = { fullname, email, phone, people, date, time, code }

    // message
    const message = {
        from: "Website <website@iandesign.it>",
        to: email,
        subject: "Prenotazione effettuata con successo!",
        html: (`
            <p><strong>Codice prenotazione:</strong> ${code}</p>
            <hr />
            <p><strong>Data:</strong> ${date}</p>
            <p><strong>Orario:</strong> ${time}</p>
            <hr />
            <p><strong>Nome e cognome:</strong> ${fullname}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefono:</strong> ${phone}</p>
        `)
    }

    try {
        await db.collection("reservations").insertOne(reservation)

        // not user request and date is today
        if (!check_user && date == today) {
            await fetch(process.env.NEXT_PUBLIC_WS_API_URL as string, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Nuova prenotazione' })
            })
        }

        await transporter.verify()
        await transporter.sendMail(message)

        revalidatePath("/private/prenotazioni")
        return { success: true }
    }
    catch { return { errors: "Si è verificato un errore, riprova più tardi" } }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// update reservations
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function updateReservationAction(id: string, formData: UpdateProps) {

    const _id = new ObjectId(id)

    // data
    const { people, date, time } = formData
    const reservation = { people, date, time }

    try {
        await db.collection("reservations").updateOne({ _id: _id }, { $set: reservation })
        revalidatePath("/private/prenotazioni")
        return { success: true }
    } catch { return { errors: "Si è verificato un errore, riprova più tardi" } }

}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// delete reservations
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function deleteReservationAction(id: string): Promise<{ success: boolean }> {
    const _id = new ObjectId(id)
    const result = await db.collection("reservations").deleteOne({ _id: _id })
    if (result.deletedCount === 0) return { success: false }
    revalidatePath("/private/prenotazioni")
    return { success: true }
}