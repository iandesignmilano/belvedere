"use server"

// next
import { redirect } from 'next/navigation'

// db
import { db } from '@/lib/db'

// check
import { decryptPassword } from '@/lib/hash'

// auth
import { createSession, destroySession } from '@/lib/session'

// yup
import * as yup from "yup"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// login helper
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface loginActionProps { email: string; password: string; }

const schema = yup.object({
    email: yup.string().required("L'email è obbligatoria").email("Inserisci un'email valida"),
    password: yup.string().required("La password è obbligatoria").min(8, "La password deve contenere almeno 8 caratteri")
})

async function getUserByEmail(email: string) {
    return await db.collection("users").findOne({ email })
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// login
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function loginAction(formData: loginActionProps) {

    // data
    const { email, password } = formData

    // check data
    try { await schema.validate({ email, password }) }
    catch { return { errors: "Si è verificato un errore, riprova più tardi" } }

    // check email
    const user = await getUserByEmail(email)
    if (!user) return { errors: "Si è verificato un errore, riprova più tardi" }

    // check password
    const check = decryptPassword(user.password, password)
    if (!check) return { errors: "Si è verificato un errore, riprova più tardi" }

    await createSession(user._id.toString())
    redirect("/private")
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// logout
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function logoutAction() {
    await destroySession()
    redirect('/private/login')
}