"use client"

import { useState } from "react"

// shad
import { Button } from "../../ui/button"
import { Input } from "@/components/ui/input"

// icons
import { Search, Trash } from "lucide-react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface SearchReservationsProps {
    searchData: (val: string) => void
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function SearchReservations({ searchData }: SearchReservationsProps) {

    const [search, setSearch] = useState("")

    return (
        <section className="flex items-center gap-2">
            <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cerca..."
            />
            <Button
                size="icon"
                disabled={!search}
                className="rounded-full cursor-pointer"
                onClick={() => searchData(search)}
            >
                <Search />
            </Button>
            {search.length > 0 && (
                <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full cursor-pointer"
                    onClick={() => {
                        setSearch("")
                        searchData("")
                    }}
                >
                    <Trash />
                </Button>
            )}
        </section>
    )
}