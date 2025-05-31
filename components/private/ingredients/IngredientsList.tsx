"use client"

import React, { useState } from "react"

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

export default function IngredientsList({ ingredients }: { ingredients: IngredientsProps[] }) {

    const [ingredientsList, setIngredientsList] = useState<IngredientsProps[]>(ingredients)

    function filterData(value: string) {
        if (!value) setIngredientsList(ingredients)
        const filtered = ingredients.filter((el) => el.name.toLowerCase().includes(value.toLowerCase()))
        setIngredientsList(filtered)
    }

    return (
        <>
            <div className="grid lg:grid-cols-2 gap-4">
                <div>
                    <SearchIngredients filterData={filterData} />
                </div>
                <div className="text-right">
                    <FormIngredients type="create">
                        <Button className="custom-button max-lg:w-full">Aggiungi ingrediente</Button>
                    </FormIngredients>
                </div>
            </div>
            <Separator />
            {ingredientsList.map((el) => (
                <React.Fragment key={el._id}>
                    <div className="space-y-2">
                        <h2 className="text-xl text-primary">{el.name}</h2>
                        <h4 className="text-foreground">{el.price}€</h4>
                        <div className="flex items-center gap-4 justify-end">
                            <FormIngredients type="update" id={el._id}>
                                <Button size="icon" className="rounded-full">
                                    <Pen />
                                </Button>
                            </FormIngredients>
                            <DeleteIngredient id={el._id} />
                        </div>
                    </div>
                    <Separator />
                </React.Fragment>
            ))}
        </>
    )
} 