'use server'

// next
import { cookies } from 'next/headers'

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface saveCookiePreferencesProps {
    necessary: boolean
    analytics: boolean
    marketing: boolean
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// cookie save
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function saveCookiePreferences(preferences: saveCookiePreferencesProps) {

    const cookie = await cookies()

    cookie.set(
        'cookie_preferences',
        JSON.stringify(preferences),
        { path: '/', maxAge: 60 * 60 * 24 * 365 }
    )
}
