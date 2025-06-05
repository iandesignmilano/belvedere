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

export type TablesProps = {
    _id: string
    people: string
    total: string
}

type ActionProps = {
    people: string
    total: string
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// get tables
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getTables() {
    const tables = await db.collection("tables").find().toArray()
    const result = tables.map((el) => ({ _id: el._id.toString(), people: el.people, total: el.total }))
    return result
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// get table
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getTable(id: string) {
    const _id = new ObjectId(id)
    const table = await db.collection("tables").findOne({ _id })
    if (!table) return null
    return { _id: table._id.toString(), people: table.people, total: table.total }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// add table
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function addTableAction(formData: ActionProps) {

    // data
    const { people, total } = formData
    const table = { people, total }

    try {
        await db.collection("tables").insertOne(table)
        revalidatePath("/private/tavoli")
        return { success: true }
    }
    catch { return { errors: "Si è verificato un errore, riprova più tardi" } }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// update table
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function updateTableAction(id: string, formData: ActionProps) {

    const _id = new ObjectId(id)

    // data
    const { people, total } = formData
    const table = { people, total }

    try {
        await db.collection("tables").updateOne({ _id: _id }, { $set: table })
        revalidatePath("/private/tavoli")
        return { success: true }
    } catch { return { errors: "Si è verificato un errore, riprova più tardi" } }

}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// delete table
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function deleteTableAction(id: string): Promise<{ success: boolean }> {
    const _id = new ObjectId(id)
    const result = await db.collection("tables").deleteOne({ _id: _id })
    if (result.deletedCount === 0) return { success: false }
    revalidatePath("/private/tavoli")
    return { success: true }
}