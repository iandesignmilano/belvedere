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

export type IngredientsProps = {
    _id: string
    name: string
    price: string
    xl: string
}

type ActionProps = {
    name: string
    price: string
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// get ingredients
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getIngredients() {
    const ingredients = await db.collection("ingredients").find().toArray()
    const result = ingredients.map((el) => ({ _id: el._id.toString(), name: el.name, price: el.price, xl: el.xl }))
    return result
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// get ingredient
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getIngredient(id: string) {
    const _id = new ObjectId(id)
    const ingredient = await db.collection("ingredients").findOne({ _id })
    if (!ingredient) return null
    return { _id: ingredient._id.toString(), name: ingredient.name, price: ingredient.price }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// add ingredient
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function addIngredientAction(formData: ActionProps) {

    // data
    const { name, price } = formData
    const xl = parseFloat(price) + 1.5

    const ingredient = {
        name,
        price: parseFloat(price).toFixed(2).toString(),
        xl: xl.toFixed(2).toString()
    }

    try {
        await db.collection("ingredients").insertOne(ingredient)
        revalidatePath("/private/ingredienti")
        revalidatePath("/ordina")
        return { success: true }
    }
    catch { return { errors: "Si è verificato un errore, riprova più tardi" } }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// update ingredient
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function updateIngredientAction(id: string, formData: ActionProps) {

    const _id = new ObjectId(id)

    // data
    const { name, price } = formData
    const xl = parseFloat(price) + 1.5

    const ingredient = {
        name,
        price: parseFloat(price).toFixed(2).toString(),
        xl: xl.toFixed(2).toString()
    }

    try {
        await db.collection("ingredients").updateOne({ _id: _id }, { $set: ingredient })
        revalidatePath("/private/ingredienti")
        revalidatePath("/ordina")
        return { success: true }
    } catch { return { errors: "Si è verificato un errore, riprova più tardi" } }

}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// delete ingredient
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function deleteIngredientAction(id: string): Promise<{ success: boolean }> {
    const _id = new ObjectId(id)
    const result = await db.collection("ingredients").deleteOne({ _id: _id })
    if (result.deletedCount === 0) return { success: false }
    revalidatePath("/private/ingredienti")
    revalidatePath("/ordina")
    return { success: true }
}