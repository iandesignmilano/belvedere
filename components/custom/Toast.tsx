// shad
import { toast } from "sonner"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// success
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export function ToastSuccess(text: string) {
    toast.success(
        text,
        { className: "!bg-green-600 !text-white !border-green-600" }
    )
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// danger
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export function ToastDanger(text?: string) {
    toast.error(
        text ? text : "Si è verificato un errore. Riprova.",
        { className: "!bg-destructive !text-white !border-destructive" }
    )
}