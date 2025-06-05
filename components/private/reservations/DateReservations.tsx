"use client"

import { useState } from "react"

// shad
import { Button } from "../../ui/button"
import { DatePicker } from "@/components/ui/datePicker"

// icons
import { Search, Trash } from "lucide-react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface DateReservationsProps {
    searchDataByDate: (val: string) => void
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function DateReservations({ searchDataByDate }: DateReservationsProps) {

    const [dt, setDt] = useState("")

    return (
        <section className="flex items-center gap-2">
            <DatePicker
                className="w-auto grow"
                placeholder="Cerca per giorno"
                value={dt}
                onChange={(date) => setDt(date || "")}
            />
            <Button
                size="icon"
                disabled={!dt}
                className="rounded-full cursor-pointer"
                onClick={() => searchDataByDate(dt)}
            >
                <Search />
            </Button>
            {dt.length > 0 && (
                <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full cursor-pointer"
                    onClick={() => {
                        setDt("")
                        searchDataByDate("")
                    }}
                >
                    <Trash />
                </Button>
            )}
        </section>
    )
}