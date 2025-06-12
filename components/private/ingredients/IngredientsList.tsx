"use client"

import React, { useState, useEffect } from "react"

// shad
import { Button } from "../../ui/button"
import { Separator } from "../../ui/separator"

// interface
import { IngredientsProps } from "@/actions/ingredients"

// icons
import { Pen } from "lucide-react"

// components
import DeleteIngredient from "./DeleteIngredient"
import SearchIngredients from "./SearchIngredients"
import FormIngredients from "@/components/custom/form/FormIngredients"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function IngredientsList({ ingredients, privileges }: { ingredients: IngredientsProps[], privileges: string }) {

    // --------------------------------------------------------------
    // data
    // --------------------------------------------------------------

    const [ingredientsList, setIngredientsList] = useState<IngredientsProps[]>(ingredients)
    useEffect(() => { setIngredientsList(ingredients) }, [ingredients])

    // --------------------------------------------------------------
    // search
    // --------------------------------------------------------------

    function searchData(value: string) {
        if (!value) setIngredientsList(ingredients)
        const filtered = ingredients.filter((el) => el.name.toLowerCase().includes(value.toLowerCase()))
        setIngredientsList(filtered)
    }

    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------

    return (
        <>
            <div className="grid lg:grid-cols-2 gap-4">
                <div>
                    <SearchIngredients searchData={searchData} />
                </div>
                {(privileges == "all" || privileges.includes("create")) && (
                    <div className="text-right">
                        <FormIngredients type="create">
                            <Button className="custom-button max-lg:w-full">Aggiungi ingrediente</Button>
                        </FormIngredients>
                    </div>
                )}
            </div>
            <Separator />
            {ingredientsList.length == 0 && (
                <h2 className="text-xl text-destructive">Nessun ingrediente aggiunto</h2>
            )}
            {ingredientsList.map((el) => (
                <React.Fragment key={el._id}>
                    <div className="space-y-2">
                        <h2 className="text-xl text-primary">{el.name}</h2>
                        <h4 className="text-foreground flex items-center gap-4">
                            <span>Base: {el.price}€ </span>
                            <span className="text-primary font-bold">XL: {el.xl}€</span>
                        </h4>
                        {(privileges == "all" || privileges.includes('update') || privileges.includes('delete')) && (
                            <div className="flex items-center gap-4 justify-end">
                                {(privileges == "all" || privileges.includes('update')) && (
                                    <FormIngredients type="update" id={el._id}>
                                        <Button size="icon" className="rounded-full">
                                            <Pen />
                                        </Button>
                                    </FormIngredients>
                                )}
                                {(privileges == "all" || privileges.includes('delete')) && <DeleteIngredient id={el._id} />}
                            </div>
                        )}
                    </div>
                    <Separator />
                </React.Fragment>
            ))}
        </>
    )
} 