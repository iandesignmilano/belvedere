"use client"

// shad
import { toast } from "sonner"
import { Button } from "../../ui/button"

// components
import { ToastDanger, ToastSuccess } from "@/components/custom/Toast"

// action
import { deleteIngredientAction } from "@/actions/ingredients"
import { deleteDrinkAction } from "@/actions/drinks"
import { deleteOutlineAction } from "@/actions/outlines"
import { deleteItemMenuAction } from "@/actions/menu"

// icon
import { Trash } from "lucide-react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface DeleteIngredientProps {
    id: string
    name: "ingrediente" | "bibita" | "contorno" | "pizza"
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// data
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const listData = {
    ingrediente: {
        title: "L’ingrediente sarà eliminato a meno che non annulli entro 10 secondi.",
        success: "Ingrediente eliminato con successo!",
        action: deleteIngredientAction
    },
    bibita: {
        title: "La bibita sarà eliminata a meno che non annulli entro 10 secondi.",
        success: "Bibita eliminata con successo!",
        action: deleteDrinkAction
    },
    contorno: {
        title: "Il contorno sarà eliminato a meno che non annulli entro 10 secondi.",
        success: "Contorno eliminato con successo!",
        action: deleteOutlineAction
    },
    pizza: {
        title: "Questa pizza sarà eliminata a meno che non annulli entro 10 secondi.",
        success: "Pizza eliminata con successo!",
        action: deleteItemMenuAction
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function DeleteElement({ id, name }: DeleteIngredientProps) {

    // --------------------------------------------------------------
    // toast
    // --------------------------------------------------------------

    function handleToast(id: string) {
        toast.custom(
            (t) => (
                <div className="p-4 rounded-md shadow-md bg-destructive text-white border border-destructive max-w-md mx-auto w-full space-y-4">
                    <p className="font-semibold">Eliminazione in corso...</p>
                    <p className="text-sm opacity-90">{listData[name].title}</p>
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
            const res = await listData[name].action(id)
            if (!res.success) {
                ToastDanger()
                return
            }
            ToastSuccess(listData[name].success)
        } catch { ToastDanger() }
    }

    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------

    return (
        <Button variant="destructive" size="icon" className="rounded-full" onClick={() => handleToast(id)}>
            <Trash />
        </Button>
    )
}