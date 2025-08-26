// shad
import { Button } from "../../ui/button"
import { Input } from "@/components/ui/input"

// icons
import { Trash } from "lucide-react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface SearchOrdersProps {
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function SearchOrders({ search, setSearch }: SearchOrdersProps) {
    return (
        <section className="flex items-center gap-2">
            <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cerca..."
            />
            {search.length > 0 && (
                <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full cursor-pointer"
                    onClick={() => setSearch("")}
                >
                    <Trash />
                </Button>
            )}
        </section>
    )
}