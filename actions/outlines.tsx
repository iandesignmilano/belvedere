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

export type OutlinesProps = {
    _id: string
    name: string
    price: string
}

type ActionProps = {
    name: string
    price: string
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// get ingredients
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getOutlines() {
    const outlines = await db.collection("outlines").find().toArray()
    const result = outlines.map((el) => ({ _id: el._id.toString(), name: el.name, price: el.price }))
    return result
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// get ingredient
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getOutline(id: string) {
    const _id = new ObjectId(id)
    const outline = await db.collection("outlines").findOne({ _id })
    if (!outline) return null
    return { _id: outline._id.toString(), name: outline.name, price: outline.price }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// add ingredient
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function addOutlineAction(formData: ActionProps) {

    // data
    const { name, price } = formData

    const outline = {
        name,
        price: parseFloat(price).toFixed(2).toString()
    }

    try {
        await db.collection("outlines").insertOne(outline)
        revalidatePath("/private/contorni")
        revalidatePath("/ordina")
        return { success: true }
    }
    catch { return { errors: "Si è verificato un errore, riprova più tardi" } }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// update ingredient
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function updateOutlineAction(id: string, formData: ActionProps) {

    const _id = new ObjectId(id)

    // data
    const { name, price } = formData

    const outline = {
        name,
        price: parseFloat(price).toFixed(2).toString()
    }

    try {
        await db.collection("outlines").updateOne({ _id: _id }, { $set: outline })
        revalidatePath("/private/contorni")
        revalidatePath("/ordina")
        return { success: true }
    } catch { return { errors: "Si è verificato un errore, riprova più tardi" } }

}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// delete ingredient
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function deleteOutlineAction(id: string): Promise<{ success: boolean }> {
    const _id = new ObjectId(id)
    const result = await db.collection("outlines").deleteOne({ _id: _id })
    if (result.deletedCount === 0) return { success: false }
    revalidatePath("/private/contorni")
    revalidatePath("/ordina")
    return { success: true }
}