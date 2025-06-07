"use client"

import React, { useState, useEffect } from "react"

// shad
import { Button } from "../../ui/button"
import { Separator } from "../../ui/separator"

// actions and hook
import { ReservationsProps, getReservations, getReservationsByDate } from "@/actions/reservations"
import { useSocket } from "@/components/custom/Socket"

// icons
import { Pen } from "lucide-react"

// components
import DateReservations from "./DateReservations"
import DeleteReservation from "./DeleteReservation"
import SearchReservations from "./SearchReservations"
import FormReservationPrivate from "@/components/custom/form/reservation/FormReservationPrivate"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface ReservationsListProps {
    reservations: ReservationsProps[]
    user?: string
    privileges: string
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function ReservationsList({ reservations, user, privileges }: ReservationsListProps) {

    const { updateData, setUpdateData } = useSocket()

    // --------------------------------------------------------------
    // data
    // --------------------------------------------------------------

    const [list, setList] = useState<ReservationsProps[]>(reservations)
    useEffect(() => { setList(reservations) }, [reservations])

    // --------------------------------------------------------------
    // search
    // --------------------------------------------------------------

    function searchData(value: string) {
        if (!value) setList(reservations)
        const filtered = reservations.filter((el) => {
            const search = value.toLowerCase()
            return (el.code.toLowerCase().includes(search) || el.fullname.toLowerCase().includes(search))
        })
        setList(filtered)
    }

    // --------------------------------------------------------------
    // search by date
    // --------------------------------------------------------------

    async function searchDataByDate(value: string) {
        if (!value) {
            setList(reservations)
            return
        }
        const data = await getReservationsByDate(value)
        setList(data)
    }

    // --------------------------------------------------------------
    // web socket
    // --------------------------------------------------------------

    useEffect(() => {
        async function newData() {
            if (updateData == "reservation") {
                const newData = await getReservations()
                if (newData) setList(newData)
                setUpdateData("")
            }
        }
        newData()
    }, [updateData, setUpdateData])

    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------

    return (
        <>
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <div>
                    <DateReservations searchDataByDate={searchDataByDate} />
                </div>
                <div>
                    <SearchReservations searchData={searchData} />
                </div>
                {(privileges == "all" || privileges.includes("create")) && (
                    <div className="text-right lg:col-span-2 xl:col-span-1">
                        <FormReservationPrivate type="create" user={user}>
                            <Button className="custom-button max-xl:w-full">Aggiungi prenotazione</Button>
                        </FormReservationPrivate>
                    </div>
                )}
            </div>
            <Separator />
            {list.length == 0 && (
                <h2 className="text-xl text-destructive">Nessuna prenotazione per questa giornata</h2>
            )}
            {list.map((el) => (
                <React.Fragment key={el._id}>
                    <div className="space-y-2">
                        <h2 className="text-xl text-primary">({el.code}) {el.fullname} x {el.people}</h2>
                        <h4 className="text-foreground">{el.date} | {el.time}</h4>
                        <h4 className="text-muted-foreground">{el.phone}</h4>
                        {(privileges == "all" || privileges.includes('update') || privileges.includes('delete')) && (
                            <div className="flex items-center gap-4 justify-end">
                                {(privileges == "all" || privileges.includes('update')) && (
                                    <FormReservationPrivate type="update" id={el._id}>
                                        <Button size="icon" className="rounded-full">
                                            <Pen />
                                        </Button>
                                    </FormReservationPrivate>
                                )}
                                {(privileges == "all" || privileges.includes('delete')) && <DeleteReservation id={el._id} />}
                            </div>
                        )}
                    </div>
                    <Separator />
                </React.Fragment>
            ))}
        </>
    )
}