// shad
import { Button } from "../../ui/button"
import { DatePicker } from "@/components/ui/datePicker"

// icons
import { Trash } from "lucide-react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface DateOrdersProps {
    dt: string
    setDt: React.Dispatch<React.SetStateAction<string>>
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function DateOrders({ dt, setDt }: DateOrdersProps) {
    return (
        <section className="flex items-center gap-2">
            <DatePicker
                className="w-auto grow"
                placeholder="Cerca per giorno"
                value={dt}
                onChange={(date) => setDt(date || "")}
            />
            {dt.length > 0 && (
                <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full cursor-pointer"
                    onClick={() => setDt("")}
                >
                    <Trash />
                </Button>
            )}
        </section>
    )
}