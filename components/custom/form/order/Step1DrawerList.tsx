import React from "react"

// shad
import { Separator } from "@/components/ui/separator"

// icons
import { ChevronRight } from "lucide-react"

// interface
import { GetDataProps } from "./Step1"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interfaces
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface Step1DrawerProps {
    name: string
    list: GetDataProps[]
    getSelected: (data: GetDataProps) => void
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Step1DrawerList({ list, getSelected, name }: Step1DrawerProps) {
    return (
        <>
            {list.length > 0 && (
                list.map((el, i) => (
                    <React.Fragment key={i}>
                        <div className="cursor-pointer flex items-center justify-between" onClick={() => getSelected(el)}>
                            <div className="space-y-2">
                                <h2 className="text-xl text-primary">{el.name}</h2>
                                <p className="flex items-center gap-2">
                                    <span>{name == "pizze" ? `Base: ${el.total_base}` : `Prezzo: ${el.price}`}</span>
                                    {name == 'pizze' && (
                                        <span className="text-primary">XL: {el.total_xl}</span>
                                    )}
                                </p>
                                {el.ingredients && (
                                    <p className="text-muted-foreground text-sm">
                                        {el.ingredients.map(ing => ing.name).join(", ")}
                                    </p>
                                )}
                            </div>
                            <ChevronRight className="size-6 text-muted-foreground" />
                        </div>
                        <Separator />
                    </React.Fragment>
                ))
            )}

            {list.length == 0 && (
                <p className="text-base text-destructive">Nessuna pietanza o bibita trovata</p>
            )}
        </>
    )
}