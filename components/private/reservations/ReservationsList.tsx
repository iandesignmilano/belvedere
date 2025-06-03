import React from "react"

// shad
import { Button } from "../../ui/button"
import { Separator } from "../../ui/separator"

// actions
import { ReservationsProps } from "@/actions/reservations"

// icons
import { Pen } from "lucide-react"

// components
import DeleteReservation from "./DeleteReservation"
import FormReservationPrivate from "@/components/custom/form/reservation/FormReservationPrivate"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function ReservationsList({ reservations }: { reservations: ReservationsProps[] }) {
    return (
        <>
            <div className="text-right">
                <FormReservationPrivate type="create">
                    <Button className="custom-button max-lg:w-full">Aggiungi prenotazione</Button>
                </FormReservationPrivate>
            </div>
            <Separator />
            {reservations.length == 0 && (
                <h2 className="text-xl text-destructive">Nessuna prenotazione per oggi</h2>
            )}
            {reservations.map((el) => (
                <React.Fragment key={el._id}>
                    <div className="space-y-2">
                        <h2 className="text-xl text-primary">({el.code}) {el.fullname} x {el.people}</h2>
                        <h4 className="text-foreground">{el.date} | {el.time}</h4>
                        <h4 className="text-muted-foreground">{el.phone}</h4>
                        <div className="flex items-center gap-4 justify-end">
                            <FormReservationPrivate type="update" id={el._id}>
                                <Button size="icon" className="rounded-full">
                                    <Pen />
                                </Button>
                            </FormReservationPrivate>
                            <DeleteReservation id={el._id} />
                        </div>
                    </div>
                    <Separator />
                </React.Fragment>
            ))}
        </>
    )
}