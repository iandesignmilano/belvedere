"use client"

import React, { useState, useEffect } from "react"

// shad
import { Button } from "../../ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "../../ui/separator"

// actions and hook
import { ReservationsProps, getReservations } from "@/actions/reservations"
import { useSocket } from "@/components/custom/Socket"

// icons
import { Pen, Phone, Calendar, Blocks } from "lucide-react"

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

    // search
    const [search, setSearch] = useState("")

    // date
    const [dt, setDt] = useState("")

    // data
    const [list, setList] = useState<ReservationsProps[]>(reservations)

    // --------------------------------------------------------------
    // update data
    // --------------------------------------------------------------

    useEffect(() => {
        const run = async () => {
            let base = reservations

            if (dt) {
                const data = await getReservations(dt)
                base = data
            }

            if (search) {
                const s = search.toLowerCase()
                base = base.filter(el => el.code.toLowerCase().includes(s) || el.fullname.toLowerCase().includes(s))
            }

            setList(base)
        }

        run()
    }, [reservations, dt, search])

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
            <div className="grid lg:grid-cols-3 gap-4">
                <div>
                    <DateReservations dt={dt} setDt={setDt} />
                </div>
                <div>
                    <SearchReservations search={search} setSearch={setSearch} />
                </div>
                {(privileges == "all" || privileges.includes("create")) && (
                    <div>
                        <FormReservationPrivate type="create" user={user}>
                            <Button className="custom-button w-full">
                                Aggiungi prenotazione
                            </Button>
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
                        {el.type == "online" ? <Badge>Online</Badge> : <Badge variant="outline">In sede</Badge>}
                        <h2 className="text-xl text-primary">({el.code}) {el.fullname} x {el.people}</h2>
                        <h4 className="text-sm text-foreground flex gap-2 items-center">
                            <Calendar className="size-4" />
                            <span>{el.date} | {el.time}</span>
                        </h4>
                        <h4 className="text-sm text-foreground flex gap-2 items-center">
                            <Blocks className="size-4" />
                            <span>Tavolo: {el.table}</span>
                        </h4>
                        <h4 className="text-sm text-muted-foreground flex gap-2 items-center">
                            <Phone className="size-4" />
                            <span>{el.phone}</span>
                        </h4>
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