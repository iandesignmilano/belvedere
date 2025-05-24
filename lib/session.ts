// next
import { cookies } from 'next/headers'

// auth
import { Lucia } from "lucia"
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb"

// db
import { User, Session } from './db'
import { ObjectId } from 'mongodb';

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseUserAttributes {
    code: string;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// adapter
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const adapter = new MongodbAdapter(Session, User)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// lucia
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const lucia = new Lucia(
    adapter,
    {
        sessionCookie: {
            // expires: false,
            attributes: { secure: process.env.NODE_ENV == 'production' }
        },
        getUserAttributes: (attributes) => { return { code: attributes.code } }
    },
)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// create session
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function createSession(userId: ObjectId) {

    // create session
    const session = await lucia.createSession(userId.toString(), {})
    const sessionCookie = lucia.createSessionCookie(session.id)

    // set cookie
    const ck = await cookies()
    ck.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// verify auth
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function verifyAuth() {

    // get cookie
    const ck = await cookies()
    const sessionCookie = ck.get(lucia.sessionCookieName)

    if (!sessionCookie) return { user: null, session: null }

    // get value
    const sessionCookieValue = sessionCookie.value
    if (!sessionCookieValue) return { user: null, session: null }

    // validate
    const result = await lucia.validateSession(sessionCookieValue)

    // new session cookie or delete session if not valid
    try {
        if (result.session && result.session.fresh) {
            const sessionCookie = lucia.createSessionCookie(result.session.id)
            ck.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
        }
        if (!result.session) {
            const sessionCookie = lucia.createBlankSessionCookie()
            ck.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
        }
    } catch { }

    // end
    return result
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// destroy session (logout)
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function destroySession() {
    const { session } = await verifyAuth()

    // check
    if (!session) return { error: "Non sei autorizzato" }

    // logout
    await lucia.invalidateSession(session.id)

    const ck = await cookies()
    const sessionCookie = lucia.createBlankSessionCookie()
    ck.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
}