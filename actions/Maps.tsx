/* eslint-disable @typescript-eslint/no-explicit-any */

"use server"

// interface
import { AddressProps } from "./orders"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// street
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function StreetMaps(input: string) {
    if (!input || input.length < 3) return []

    const uri = encodeURIComponent(input)
    const url = "https://nominatim.openstreetmap.org/search"
    const viewbox = "9.0665,45.6313,9.2045,45.5343" // left - top - right - bottom



    const res = await fetch(`${url}?q=${uri}&format=json&addressdetails=1&countrycodes=IT&limit=5&viewbox=${viewbox}&bounded=1`)

    if (!res.ok) return []

    const data = await res.json()

    const results = data.map((item: Record<string, any>) => ({
        display_name: item.display_name,
        street: item.address.road,
        street_number: item.address.house_number,
        city: item.address.town || item.address.city || item.address.count,
        cap: item.address.postcode,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon)
    }))

    return results
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// check zone
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function GetZone(address: AddressProps) {
    const minLon = 9.0665
    const maxLon = 9.2045
    const maxLat = 45.6313
    const minLat = 45.5343

    const midLon = (minLon + maxLon) / 2
    const midLat = (minLat + maxLat) / 2


    const query = `${address.street} ${address.street_number}, ${address.city}, ${address.cap}, Italia`
    const results = await StreetMaps(query)
    if (results.length > 0) {
        const { lat, lon } = results[0]

        if (lat >= midLat && lon <= midLon) return "Z1" // Nord-Ovest
        if (lat >= midLat && lon > midLon) return "Z2" // Nord-Est
        if (lat < midLat && lon <= midLon) return "Z3" // Sud-Ovest
        if (lat < midLat && lon > midLon) return "Z4" // Sud-Est
    }

    return null // fuori zona
}