"use server"

// next
import { revalidatePath } from 'next/cache'

// db
import { db } from '@/lib/db'

// auth
import { cryptPassword } from '@/lib/hash'

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

type User = {
    _id: string
    fullname: string
    email: string
    password: string
    superuser: boolean
    privileges: string
}

export type UsersData = {
    _id: string
    fullname: string
    email: string
    superuser: boolean
    privileges: string
}

interface UserActionProps {
    fullname: string
    email: string
    password: string
    superuser: boolean
    privileges: string
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// get users data
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getUsers(): Promise<UsersData[]> {
    const users = await db
        .collection<User>("users")
        .find({}, { projection: { fullname: 1, email: 1, _id: 1, superuser: 1, privileges: 1 } })
        .toArray()
    return users
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// get user data
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getUserById(_id: string): Promise<User | null> {
    const user = await db.collection<User>("users").findOne({ _id })
    if (!user) return null
    return user
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// create user
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function generateHexId(): string {
    return [...crypto.getRandomValues(new Uint8Array(24 / 2))].map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function createUserAction(formData: UserActionProps) {

    // data
    const { fullname, email, password, superuser, privileges } = formData

    // check email
    const existing = await db.collection<User>("users").findOne({ email })
    if (existing) return { errors: "Esiste già un account con questa email." }

    // data
    const hash = cryptPassword(password)
    const _id = generateHexId()

    const user = { _id, fullname, email, password: hash, superuser, privileges }

    try {
        await db.collection<User>("users").insertOne(user)
        revalidatePath("/private/utenti")
        return { success: true }
    }
    catch { return { errors: "Errore durante la creazione dell’utente. Riprova." } }

}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// update user
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function updateUserAction(id: string, formData: UserActionProps) {

    // data
    const { fullname, email, password, superuser, privileges } = formData

    // check user
    const existingUser = await db.collection<User>("users").findOne({ _id: id })
    if (!existingUser) return { errors: "Utente non trovato." }

    // check email
    const emailTaken = await db.collection<User>("users").findOne({ email, _id: { $ne: id } })
    if (emailTaken) return { errors: "Esiste già un account con questa email." }

    // data and password
    const updateData: Partial<User> = { fullname, email, superuser, privileges }
    if (password) updateData.password = cryptPassword(password)

    // update
    try {
        await db.collection<User>("users").updateOne({ _id: id }, { $set: updateData })
        revalidatePath("/private/utenti")
        return { success: true }
    } catch { return { errors: "Errore durante l’aggiornamento dell’utente. Riprova." } }

}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// delete user
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function deleteUserAction(id: string): Promise<{ success: boolean }> {
    const result = await db.collection<User>("users").deleteOne({ _id: id })
    if (result.deletedCount === 0) return { success: false }
    revalidatePath("/private/utenti")
    return { success: true }
}