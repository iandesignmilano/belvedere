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

type Table = {
    name: string
    people: number
    union?: string
    max?: number | string
}

export interface TablesProps extends Table {
    _id: string
}

type ActionProps = Table

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// get
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getTables() {
    const tables = await db.collection("tables").find().toArray()
    const result = tables.map((el) => ({
        _id: el._id.toString(),
        name: el.name,
        people: el.people,
        union: el.union,
        max: el.max
    }))
    return result
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// detail
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getTable(id: string) {
    const _id = new ObjectId(id)
    const table = await db.collection("tables").findOne({ _id })
    if (!table) return null
    return {
        _id: table._id.toString(),
        name: table.name,
        people: table.people,
        union: table.union,
        max: table.max
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// add
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function addTableAction(formData: ActionProps) {
    try {

        const dbTables = db.collection("tables")

        await dbTables.insertOne(formData)

        if (formData.union) await dbTables.updateOne({ name: formData.union }, { $set: { union: formData.name, max: formData.max } })

        revalidatePath("/private/tavoli")
        revalidatePath("/private/prenotazioni")
        revalidatePath("prenota")
        return { success: true }
    }
    catch { return { errors: "Si è verificato un errore, riprova più tardi" } }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// update
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function updateTableAction(id: string, formData: ActionProps) {

    const _id = new ObjectId(id)

    // data
    const { people, name, union, max } = formData
    const table = { people, name, union, max }

    try {

        const dbTables = db.collection("tables")

        await dbTables.updateOne({ _id: _id }, { $set: table })
        if (formData.union) await dbTables.updateOne({ name: formData.union }, { $set: { union: formData.name, max: formData.max } })

        revalidatePath("/private/tavoli")
        revalidatePath("/private/prenotazioni")
        revalidatePath("prenota")
        return { success: true }
    } catch { return { errors: "Si è verificato un errore, riprova più tardi" } }

}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// delete
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function deleteTableAction(id: string): Promise<{ success: boolean }> {
    const _id = new ObjectId(id)
    const dbTables = db.collection("tables")

    // rimuovo union
    const table = await dbTables.findOne({ _id })
    if (!table) return { success: false }
    if (table.union) await dbTables.updateOne({ name: table.union }, { $set: { union: "", max: "" } })

    const result = await dbTables.deleteOne({ _id: _id })
    if (result.deletedCount === 0) return { success: false }
    revalidatePath("/private/tavoli")
    revalidatePath("/private/prenotazioni")
    revalidatePath("prenota")
    return { success: true }
}