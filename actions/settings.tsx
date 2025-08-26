"use server"

// next
import { revalidatePath } from 'next/cache'

// db
import { db } from '@/lib/db'

// interface
import { ObjectId } from 'mongodb'

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export interface ActionProps {
    _id: string
    teglie: number
    prenotazione: number
    stop_prenotazioni: boolean
    stop_ordini: boolean
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// get
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getSettings() {
    const settings = await db.collection("settings").findOne()
    if (!settings) return null
    return {
        _id: settings._id.toString(),
        teglie: settings.teglie,
        prenotazione: settings.prenotazione,
        stop_prenotazioni: settings.stop_prenotazioni,
        stop_ordini: settings.stop_ordini
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// update
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function updateSettingsAction(formData: ActionProps) {

    const { teglie, prenotazione, stop_prenotazioni, stop_ordini, _id } = formData

    const id = new ObjectId(_id)

    const data = { teglie, prenotazione, stop_prenotazioni, stop_ordini }

    try {
        await db.collection("settings").updateOne({ _id: id }, { $set: data })
        revalidatePath("/private/impostazioni")
        revalidatePath("/", "layout")
        return { success: true }
    }
    catch { return { errors: "Si è verificato un errore, riprova più tardi" } }
}