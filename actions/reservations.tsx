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
import { format, isWeekend, parse, addMinutes } from "date-fns"

// lib
import { verifyAuth } from '@/lib/session'
import { generateCode } from '@/lib/code'
import { getTableResevation } from '@/lib/table'

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
    type: string
    table: string
}

export type AddProps = {
    fullname: string
    email: string
    phone: string
    people: number
    date: string
    time: string
    table?: string
}

type UpdateProps = {
    fullname: string
    phone: string
    people: number
    date: string
    time: string
    table: string
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// get
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getReservations(date?: string) {

    const dt = date ? date : format(new Date(), "dd-MM-yyyy")

    const reservations = await db
        .collection("reservations")
        .find({ date: dt })
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
        code: el.code,
        type: el.type,
        table: el.table
    }))

    return result
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// detail
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
        code: reservation.code,
        type: reservation.type,
        table: reservation.table
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// add
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function addReservationAction(formData: AddProps, user?: string, office?: string) {

    // today
    const today = format(new Date(), "dd-MM-yyyy")

    // check
    let check_user = false
    const auth = await verifyAuth()
    if (auth.user?.id && user && auth.user.id == user) check_user = true

    // data
    const { fullname, email, phone, people, date, time, table } = formData
    const code = generateCode()
    const type = office ?? "online"

    // table
    let selectedTable = ""
    if (table) selectedTable = table
    else selectedTable = await getTableResevation({ date, time, people })
    if (!selectedTable) return { errors: "Non ci sono tavoli disponibili per l'orario selezionato." }

    // data
    const reservation = { fullname, email, phone, people, date, time, code, type, table: selectedTable }

    // message
    const message = {
        from: "Pizzeria Belvedere <pizzeriabelvederesenago2000@gmail.com>",
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

        if (!office) {
            await transporter.verify()
            await transporter.sendMail(message)
        }

        revalidatePath("/private/prenotazioni")
        return { success: true }
    }
    catch { return { errors: "Si è verificato un errore, riprova più tardi" } }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// update
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function updateReservationAction(id: string, formData: UpdateProps) {

    const _id = new ObjectId(id)

    // data
    const { people, date, time, table, fullname, phone } = formData

    // table
    let selectedTable = ""
    if (table) selectedTable = table
    else selectedTable = await getTableResevation({ date, time, people })
    if (!selectedTable) return { errors: "Non ci sono tavoli disponibili per l'orario selezionato." }

    const reservation = { people, date, time, fullname, phone, table: selectedTable }

    try {
        await db.collection("reservations").updateOne({ _id: _id }, { $set: reservation })
        revalidatePath("/private/prenotazioni")
        return { success: true }
    } catch { return { errors: "Si è verificato un errore, riprova più tardi" } }

}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// delete
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function deleteReservationAction(id: string): Promise<{ success: boolean }> {
    const _id = new ObjectId(id)
    const result = await db.collection("reservations").deleteOne({ _id: _id })
    if (result.deletedCount === 0) return { success: false }
    revalidatePath("/private/prenotazioni")
    return { success: true }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// free time list
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getTableFree(date: string, people: number, reservationId?: string, resType?: string) {

    // prenotazioni
    const reservations = await db.collection("reservations").find({ date }).sort({ time: 1 }).toArray()

    // tavoli in base alle persone
    const tables = await db
        .collection("tables")
        .find({ $or: [{ people: { $gte: people } }, { max: { $gte: people } }] })
        .toArray()

    if (!tables.length && resType == "online") return []

    // orari
    const parsedDate = parse(date, "dd-MM-yyyy", new Date())
    const weekend = isWeekend(parsedDate)

    let slots: string[] = []
    if (weekend || parsedDate.getDay() === 5) slots = ["19:00", "19:15", "20:30", "20:45"]
    else {
        for (let h = 19; h <= 22; h++) {
            for (let m = 0; m < 60; m += 15) {
                if (h === 22 && m > 0) break
                slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`)
            }
        }
    }

    if (!tables.length && resType == "sede") return slots

    // permanenza
    const slotTimes = slots.map(s => ({ raw: s, date: parse(s, "HH:mm", parsedDate), }))

    // gap (in minuti)
    const settings = await db.collection("settings").findOne()
    const DURATION_MINUTES = settings?.prenotazione ? settings.prenotazione * 60 : 90

    // slot liberi
    const availableSlots: string[] = []

    for (const { raw: slot, date: slotDate } of slotTimes) {

        // calcolo fine slot
        const slotEnd = addMinutes(slotDate, DURATION_MINUTES)

        // tavoli occupati che si sovrappongono con l'intervallo [slotDate, slotEnd)
        const reservedTables = reservations
            .filter(r => {
                if (reservationId && r._id.toString() === reservationId) return false
                const resStart = parse(r.time, "HH:mm", parsedDate)
                const resEnd = addMinutes(resStart, DURATION_MINUTES)
                // verifica sovrapposizione tra intervalli
                return resStart < slotEnd && resEnd > slotDate
            })
            .flatMap(r => r.table.split(" + ").map((t: string) => t.trim()))

        // tavoli disponibili
        const freeTables = tables.filter(t => {
            const isThisReserved = reservedTables.includes(t.name)
            const isUnionReserved = reservedTables.includes(t.union) && people > t.people
            return !isThisReserved && !isUnionReserved
        })

        // tavolo disponibile per tot persone
        const match = freeTables.find(t => (t.people >= people) || (t.union && t.max >= people))
        if (match) availableSlots.push(slot)
    }

    return availableSlots
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// free table list
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getAvailableTables(date: string, time: string, reservationId?: string) {

    const reservations = await db.collection("reservations").find({ date }).toArray()

    const tables = await db.collection("tables").find().toArray()
    if (!tables.length) return []

    const parsedDate = parse(date, "dd-MM-yyyy", new Date())
    const slotDate = parse(time, "HH:mm", parsedDate)

    const settings = await db.collection("settings").findOne()
    const DURATION_MINUTES = settings?.prenotazione ? settings.prenotazione * 60 : 90

    const slotEnd = addMinutes(slotDate, DURATION_MINUTES)

    const reservedTables = reservations
        .filter(r => {
            if (reservationId && r._id.toString() === reservationId) return false

            const resStart = parse(r.time, "HH:mm", parsedDate)
            const resEnd = addMinutes(resStart, DURATION_MINUTES)

            return resStart < slotEnd && resEnd > slotDate
        })
        .flatMap(r => r.table.split(" + ").map((t: string) => t.trim()))


    const availableTables = tables.filter(t => !reservedTables.includes(t.name)).map(t => t.name)
    return availableTables
}