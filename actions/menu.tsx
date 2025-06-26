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
    xl: string,
    ingredients: {
        name: string
        price: string
        xl: string
    }[]
}


type ActionProps = {
    name: string
    price: string
    xl?: string,
    ingredients?: {
        name: string
        price: string
        xl: string
    }[]
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// get
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getMenu(totals?: number) {

    const query = db.collection("menu").find()
    if (totals) query.limit(totals)
    const menu = await query.toArray()

    const result = menu.map((el) => ({
        _id: el._id.toString(),
        name: el.name,
        price: el.price,
        xl: el.xl,
        ingredients: el.ingredients,
        total_base: el.total_base,
        total_xl: el.total_xl
    }))
    return result
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// detail
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getItemMenu(id: string) {
    const _id = new ObjectId(id)
    const menu = await db.collection("menu").findOne({ _id })
    if (!menu) return null
    return {
        _id: menu._id.toString(),
        name: menu.name,
        price: menu.price,
        xl: menu.xl,
        ingredients: menu.ingredients
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// add
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function addItemMenuAction(formData: ActionProps) {

    const basePrice = parseFloat(formData.price) || 0
    const baseXL = parseFloat(formData.xl ?? "0") || 0

    const ingredientsPrice = (formData.ingredients ?? []).reduce((sum, ing) => { return sum + (parseFloat(ing.price) || 0) }, 0)
    const ingredientsXL = (formData.ingredients ?? []).reduce((sum, ing) => { return sum + (parseFloat(ing.xl) || 0) }, 0)

    const totalPrice = basePrice + ingredientsPrice
    const totalXL = baseXL + ingredientsXL

    const data = { ...formData, total_base: totalPrice.toFixed(2), total_xl: totalXL.toFixed(2) }

    try {
        await db.collection("menu").insertOne(data)
        revalidatePath("/private/menu")
        revalidatePath("/ordina")
        revalidatePath("/menu")
        revalidatePath("/")
        return { success: true }
    }
    catch { return { errors: "Si è verificato un errore, riprova più tardi" } }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// update
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function updateItemMenuAction(id: string, formData: ActionProps) {

    const _id = new ObjectId(id)

    const basePrice = parseFloat(formData.price) || 0
    const baseXL = parseFloat(formData.xl ?? "0") || 0

    const ingredientsPrice = (formData.ingredients ?? []).reduce((sum, ing) => { return sum + (parseFloat(ing.price) || 0) }, 0)
    const ingredientsXL = (formData.ingredients ?? []).reduce((sum, ing) => { return sum + (parseFloat(ing.xl) || 0) }, 0)

    const totalPrice = basePrice + ingredientsPrice
    const totalXL = baseXL + ingredientsXL

    const data = {
        name: formData.name,
        price: formData.price,
        ingredients: formData.ingredients,
        xl: formData.xl,
        total_base: totalPrice.toFixed(2),
        total_xl: totalXL.toFixed(2)
    }

    try {
        await db.collection("menu").updateOne({ _id: _id }, { $set: data })
        revalidatePath("/private/menu")
        revalidatePath("/ordina")
        revalidatePath("/menu")
        revalidatePath("/")
        return { success: true }
    } catch (err) { console.log(err); return { errors: "Si è verificato un errore, riprova più tardi" } }

}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// delete
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function deleteItemMenuAction(id: string): Promise<{ success: boolean }> {
    const _id = new ObjectId(id)
    const result = await db.collection("menu").deleteOne({ _id: _id })
    if (result.deletedCount === 0) return { success: false }
    revalidatePath("/private/menu")
    revalidatePath("/ordina")
    revalidatePath("/menu")
    revalidatePath("/")
    return { success: true }
}