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

export type DrinskProps = {
    _id: string
    name: string
    price: string
}

type ActionProps = {
    name: string
    price: string
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// get
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getDrinks() {
    const drinks = await db.collection("drinks").find().toArray()
    const result = drinks.map((el) => ({ _id: el._id.toString(), name: el.name, price: el.price }))
    return result
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// detail
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getDrink(id: string) {
    const _id = new ObjectId(id)
    const drink = await db.collection("drinks").findOne({ _id })
    if (!drink) return null
    return { _id: drink._id.toString(), name: drink.name, price: drink.price }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// add
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function addDrinkAction(formData: ActionProps) {

    const { name, price } = formData

    const drink = {
        name,
        price: parseFloat(price).toFixed(2).toString()
    }

    try {
        await db.collection("drinks").insertOne(drink)
        revalidatePath("/private/bibite")
        revalidatePath("/ordina")
        return { success: true }
    }
    catch { return { errors: "Si è verificato un errore, riprova più tardi" } }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// update
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function updateDrinkAction(id: string, formData: ActionProps) {

    const _id = new ObjectId(id)

    const { name, price } = formData

    const drink = {
        name,
        price: parseFloat(price).toFixed(2).toString()
    }

    try {
        await db.collection("drinks").updateOne({ _id: _id }, { $set: drink })
        revalidatePath("/private/bibite")
        revalidatePath("/ordina")
        return { success: true }
    } catch { return { errors: "Si è verificato un errore, riprova più tardi" } }

}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// delete
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function deleteDrinkAction(id: string): Promise<{ success: boolean }> {
    const _id = new ObjectId(id)
    const result = await db.collection("drinks").deleteOne({ _id: _id })
    if (result.deletedCount === 0) return { success: false }
    revalidatePath("/private/bibite")
    revalidatePath("/ordina")
    return { success: true }
}