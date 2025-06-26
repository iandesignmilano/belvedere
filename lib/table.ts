// db
import { db } from '@/lib/db'

// date
import { parse, addMinutes } from "date-fns"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface getTableProps {
    date: string
    time: string
    people: number
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// table
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function getTableResevation({ date, time, people }: getTableProps) {
    const DURATION_MINUTES = 90

    const allReservations = await db
        .collection("reservations")
        .find({ date })
        .toArray()

    const parsedDate = parse(date, "dd-MM-yyyy", new Date())
    const targetTime = parse(time, "HH:mm", parsedDate)

    const reservedTables = allReservations
        .filter(r => {
            const resTime = parse(r.time, "HH:mm", parsedDate)
            const resEnd = addMinutes(resTime, DURATION_MINUTES)
            return targetTime >= resTime && targetTime < resEnd
        })
        .flatMap(r => r.table.split(" + ").map((t: string) => t.trim()))

    const exactTable = await db
        .collection("tables")
        .findOne({
            name: { $nin: reservedTables },
            union: "",
            people: Number(people)
        })

    let selectedTable = null

    if (exactTable) selectedTable = exactTable.name

    else {

        const exactUnionTable = await db
            .collection("tables")
            .findOne({
                name: { $nin: reservedTables },
                union: { $ne: "" },
                people: Number(people)
            })

        if (exactUnionTable) selectedTable = exactUnionTable.name

        else {
            const unionTables = await db
                .collection("tables")
                .find({
                    name: { $nin: reservedTables },
                    union: { $nin: reservedTables, $ne: "" },
                    max: { $gte: Number(people) }
                })
                .sort({ max: 1 })
                .toArray()

            if (unionTables.length > 0) selectedTable = `${unionTables[0].name} + ${unionTables[0].union}`
        }
    }

    return selectedTable
}