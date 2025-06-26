"use client"

import React, { useState, useEffect } from "react"

// shad
import { Button } from "../../ui/button"
import { Separator } from "../../ui/separator"

// icons
import { Pen } from "lucide-react"

// components
import DeleteElement from "./DeleteElement"
import SearchElements from "./SearchElements"
import FormElements from "@/components/custom/form/FormElements"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


type ListProps = {
    _id: string
    name: string
    price: string
    xl?: string
    ingredients?: {
        name?: string
        price?: string
        xl?: string
    }[]
    total_base?: string
    total_xl?: string
}

interface ListElementsProps {
    elements: ListProps[]
    privileges: string
    name: "ingrediente" | "bibita" | "contorno" | "pizza"
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function ListElements({ elements, privileges, name }: ListElementsProps) {

    // --------------------------------------------------------------
    // data
    // --------------------------------------------------------------

    const [dataLists, setDataLists] = useState<ListProps[]>(elements)
    useEffect(() => { setDataLists(elements) }, [elements])

    // --------------------------------------------------------------
    // search
    // --------------------------------------------------------------

    function searchData(value: string) {
        if (!value) setDataLists(elements)
        const filtered = elements.filter((el) => el.name.toLowerCase().includes(value.toLowerCase()))
        setDataLists(filtered)
    }

    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------

    return (
        <>
            <div className="grid lg:grid-cols-2 gap-4">
                <div>
                    <SearchElements searchData={searchData} />
                </div>
                {(privileges == "all" || privileges.includes("create")) && (
                    <div className="text-right">
                        <FormElements type="create" name={name}>
                            <Button className="custom-button max-lg:w-full">Aggiungi {name}</Button>
                        </FormElements>
                    </div>
                )}
            </div>
            <Separator />
            {dataLists.length == 0 && (
                <h2 className="text-xl text-destructive">
                    {name == "bibita" || name == "pizza" ? `Nessuna ${name} aggiunta` : `Nessun ${name} aggiunto`}
                </h2>
            )}
            {dataLists.map((el) => (
                <React.Fragment key={el._id}>
                    <div className="space-y-2">
                        <h2 className="text-xl text-primary">{el.name}</h2>
                        {el.ingredients && el.ingredients.length > 0 && (
                            <p className="text-slate-600 text-xs">
                                {el.ingredients.map(ing => ing.name).join(", ")}
                            </p>
                        )}
                        <h4 className="text-foreground flex items-center gap-4">
                            <span>
                                {name == "ingrediente" || name == "pizza" ? "Base: " : "Prezzo: "}
                                {name == "pizza" ? el.total_base : el.price}€
                            </span>
                            {el.xl && <span className="text-primary font-bold">XL: {name == "pizza" ? el.total_xl : el.xl}€</span>}
                        </h4>

                        {(privileges == "all" || privileges.includes('update') || privileges.includes('delete')) && (
                            <div className="flex items-center gap-4 justify-end">
                                {(privileges == "all" || privileges.includes('update')) && (
                                    <FormElements type="update" id={el._id} name={name}>
                                        <Button size="icon" className="rounded-full">
                                            <Pen />
                                        </Button>
                                    </FormElements>
                                )}
                                {(privileges == "all" || privileges.includes('delete')) && <DeleteElement id={el._id} name={name} />}
                            </div>
                        )}
                    </div>
                    <Separator />
                </React.Fragment>
            ))}
        </>
    )
} 