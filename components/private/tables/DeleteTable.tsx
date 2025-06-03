"use client"

// shad
import { toast } from "sonner"
import { Button } from "../../ui/button"

// components
import { ToastDanger, ToastSuccess } from "@/components/custom/Toast"

// action
import { deleteTableAction } from "@/actions/tables"

// icon
import { Trash } from "lucide-react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface DeleteTableProps {
    id: string
}


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function DeleteTable({ id }: DeleteTableProps) {

    // --------------------------------------------------------------
    // toast
    // --------------------------------------------------------------

    function handleToast(id: string) {
        toast.custom(
            (t) => (
                <div className="p-4 rounded-md shadow-md bg-destructive text-white border border-destructive max-w-md mx-auto w-full space-y-4">
                    <p className="font-semibold">Eliminazione in corso...</p>
                    <p className="text-sm opacity-90">Il tavolo sarà eliminato a meno che non annulli entro 10 secondi.</p>
                    <button
                        className="w-full bg-red-900 text-white text-sm font-semibold py-2 rounded-full hover:bg-bg-red-900/90 cursor-pointer"
                        onClick={() => {
                            handleDelete(id)
                            toast.dismiss(t)
                        }}
                    >
                        Elimina subito
                    </button>
                    <button
                        className="w-full bg-white text-destructive text-sm font-semibold py-2 rounded-full hover:bg-card cursor-pointer"
                        onClick={() => toast.dismiss(t)}
                    >
                        Annulla
                    </button>
                </div>
            ),
            {
                duration: 10000,
                onAutoClose: () => handleDelete(id)
            }
        )
    }

    // --------------------------------------------------------------
    // delete
    // --------------------------------------------------------------

    async function handleDelete(id: string) {
        try {
            const res = await deleteTableAction(id)
            if (!res.success) ToastDanger()
            ToastSuccess("Tavolo eliminato con successo!")
        } catch { ToastDanger() }
    }

    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------

    return (
        <Button variant="destructive" className="custom-button !text-sm grow" onClick={() => handleToast(id)}>
            <Trash />
        </Button>
    )
}