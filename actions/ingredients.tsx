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

type Ingredient = {
    name: string
    price: string
    xl: string
}

export interface IngredientsProps extends Ingredient {
    _id: string
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

        // aggiornamento
        await db.collection("ingredients").updateOne({ _id: _id }, { $set: ingredient })

        // aggiornamento prezzi menù
        const affectedMenus = await db.collection("menu").find({ ingredients: { $elemMatch: { name: name } } }).toArray()
        for (const menu of affectedMenus) {
            const updatedIngredients = menu.ingredients.map((ing: Ingredient) => {
                if (ing.name === name) return { ...ing, price: ingredient.price, xl: ingredient.xl }
                return ing
            })

            const basePrice = parseFloat(menu.price) || 0
            const baseXL = parseFloat(menu.xl) || 0

            const ingredientsPrice = updatedIngredients.reduce((sum: number, ing: any) => sum + parseFloat(ing.price || "0"), 0)
            const ingredientsXL = updatedIngredients.reduce((sum: number, ing: any) => sum + parseFloat(ing.xl || "0"), 0)

            const total_base = (basePrice + ingredientsPrice).toFixed(2)
            const total_xl = (baseXL + ingredientsXL).toFixed(2)

            await db.collection("menu").updateOne(
                { _id: menu._id },
                { $set: { ingredients: updatedIngredients, total_base, total_xl } }
            )
        }

        // revalidate
        revalidatePath("/private/ingredienti")
        revalidatePath("/ordina")
        revalidatePath("/private/menu")
        revalidatePath("/ordina")
        revalidatePath("/menu")
        revalidatePath("/")

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