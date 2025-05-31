"use server"

// next
import { revalidatePath } from 'next/cache'

// db
import { db } from '@/lib/db'

// auth
import { verifyAuth } from "@/lib/session"
import { decryptPassword, cryptPassword } from '@/lib/hash'

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

interface updateUserDataActionProps {
    email: string
    fullname: string
}

interface updateUserPasswordActionProps {
    old_password: string
    new_password: string
    repeat_new_password: string
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// get user data
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getProfileData(): Promise<{ fullname: string, email: string } | null> {
    const auth = await verifyAuth()

    // check id
    const _id = auth.user?.id
    if (!_id) return null

    // check user
    const user = await db.collection<User>("users").findOne({ _id })
    if (!user) return null

    return { fullname: user.fullname, email: user.email }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// update user data
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function updateProfileDataAction(formData: updateUserDataActionProps) {

    // data
    const { email, fullname } = formData

    // check user
    const auth = await verifyAuth()
    const _id = auth.user?.id
    if (!_id) return { errors: "Si è verificato un errore, riprova più tardi" }

    // check new email
    const existingUser = await db.collection<User>("users").findOne({ email, _id: { $ne: _id } })
    if (existingUser) return { errors: "Questa email è già associata a un altro account" }

    // update
    await db.collection<User>("users").updateOne({ _id }, { $set: { fullname, email } })
    revalidatePath("/private/profilo")
    return { success: true }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// update user password
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function updateProfilePasswordAction(formData: updateUserPasswordActionProps) {

    // data
    const { old_password, new_password } = formData

    // check user
    const auth = await verifyAuth()
    const _id = auth.user?.id
    if (!_id) return { errors: "Si è verificato un errore, riprova più tardi" }

    // check user
    const user = await db.collection<User>("users").findOne({ _id })
    if (!user) return { errors: "Utente non trovato" }

    // check old password
    const check = decryptPassword(user.password, old_password)
    if (!check) return { errors: "Si è verificato un errore, riprova più tardi" }

    // update
    const hashed = cryptPassword(new_password)
    await db.collection<User>("users").updateOne({ _id }, { $set: { password: hashed } })
    return { success: true }
}