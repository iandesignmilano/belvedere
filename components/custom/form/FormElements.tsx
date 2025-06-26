"use client"

import React, { useState, useEffect } from 'react'

// formik + yup
import { useFormik } from 'formik'
import * as yup from "yup"

// shad
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"

// components
import { ToastSuccess, ToastDanger } from "../Toast"

// icons
import { Loader2 } from "lucide-react"

// actions
import { getIngredients } from '@/actions/ingredients'
import { addIngredientAction, updateIngredientAction, getIngredient } from '@/actions/ingredients'
import { addDrinkAction, updateDrinkAction, getDrink } from '@/actions/drinks'
import { addOutlineAction, updateOutlineAction, getOutline } from '@/actions/outlines'
import { getItemMenu, addItemMenuAction, updateItemMenuAction } from '@/actions/menu'

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface FormIngredientsProps {
    children: React.ReactNode
    type: "create" | "update"
    id?: string
    name: "ingrediente" | "bibita" | "contorno" | "pizza"
}


type Ingredient = {
    name: string
    price: string
    xl: string
}

type BaseData = {
    name: string
    price: string
}

type PizzaData = {
    name: string
    price: string
    xl: string
    ingredients: Ingredient[]
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// type
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const text = {
    ingrediente: {
        create: {
            title: "Aggiungi ingrediente",
            description: "Compila i campi sottostanti per aggiungere un nuovo ingrediente alla piattaforma.",
            button: "Aggiungi ingrediente",
            msg: "Ingrediente aggiunto con successo!"
        },
        update: {
            title: "Modifica ingrediente",
            description: "Aggiorna le informazioni dell'ingrediente selezionato.",
            button: "Salva modifiche",
            msg: "Ingrediente aggiornato con successo!"
        }
    },
    bibita: {
        create: {
            title: "Aggiungi bibita",
            description: "Compila i campi sottostanti per aggiungere una nuova bibita alla piattaforma.",
            button: "Aggiungi bibita",
            msg: "Bibita aggiunta con successo!"
        },
        update: {
            title: "Modifica bibita",
            description: "Aggiorna le informazioni della bibita selezionata.",
            button: "Salva modifiche",
            msg: "Bibita aggiornata con successo!"
        }
    },
    contorno: {
        create: {
            title: "Aggiungi contorno",
            description: "Compila i campi sottostanti per aggiungere un nuovo contorno alla piattaforma.",
            button: "Aggiungi ingrediente",
            msg: "Contorno aggiunto con successo!"
        },
        update: {
            title: "Modifica contorno",
            description: "Aggiorna le informazioni del contorno selezionato.",
            button: "Salva modifiche",
            msg: "Contorno aggiornato con successo!"
        }
    },
    pizza: {
        create: {
            title: "Aggiungi pizza",
            description: "Compila i campi sottostanti per aggiungere una nuova pizza alla piattaforma.",
            button: "Aggiungi pizza",
            msg: "Pizza aggiunta con successo!"
        },
        update: {
            title: "Modifica pizza",
            description: "Aggiorna le informazioni della pizza selezionata.",
            button: "Salva modifiche",
            msg: "Pizza aggiornata con successo!"
        }
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// data
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const functionData = {
    ingrediente: {
        add: addIngredientAction,
        update: updateIngredientAction,
        get: getIngredient
    },
    bibita: {
        add: addDrinkAction,
        update: updateDrinkAction,
        get: getDrink
    },
    contorno: {
        add: addOutlineAction,
        update: updateOutlineAction,
        get: getOutline
    },
    pizza: {
        add: addItemMenuAction,
        update: updateItemMenuAction,
        get: getItemMenu
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// form 
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const getSchema = (name: string) => {
    if (name == 'pizza') {
        return (
            yup.object({
                name: yup.string().required("Il nome è obbligatorio"),

                price: yup
                    .string()
                    .required("Il prezzo base è obbligatorio")
                    .matches(/^\d+(\.\d{1,2})?$/, "Il prezzo deve essere un numero valido"),

                xl: yup
                    .string()
                    .required("Il prezzo XL è obbligatorio")
                    .matches(/^\d+(\.\d{1,2})?$/, "Il prezzo deve essere un numero valido"),

                ingredients: yup
                    .array()
                    .of(
                        yup.object({
                            name: yup.string().optional(),
                            price: yup.string().optional(),
                            xl: yup.string().optional()
                        })
                    )
                    .nullable(),
            })
        )
    }

    return (
        yup.object({
            name: yup.string().required("Il nome è obbligatorio"),

            price: yup
                .string()
                .required("Il prezzo è obbligatorio")
                .matches(/^\d+(\.\d{1,2})?$/, "Il prezzo deve essere un numero valido")
        })
    )
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function FormElements({ children, type, id, name }: FormIngredientsProps) {

    const [open, setOpen] = useState(false)

    const initialData = name == "pizza" ? { name: "", price: "", xl: "", ingredients: [] as Ingredient[] } : { name: "", price: "" }
    const [initial, setInitial] = useState(initialData)

    const schema = getSchema(name)

    // --------------------------------------------------------------
    // ingredients
    // --------------------------------------------------------------

    const [allIngredients, setAllIngredients] = useState<Record<string, string>[]>([])

    useEffect(() => {
        async function getData() {
            const data = await getIngredients()
            if (data) setAllIngredients(data)
        }
        getData()
    }, [])

    // --------------------------------------------------------------
    // data (update)
    // --------------------------------------------------------------

    useEffect(() => {
        async function getData() {

            if (!id) return

            if (name === "pizza") {
                const data = await functionData.pizza.get(id) as PizzaData
                if (!data) return ToastDanger()
                setInitial(data)
            } else {
                const data = await functionData[name].get(id) as BaseData
                if (!data) return ToastDanger()
                setInitial(data)
            }
        }
        getData()
    }, [id, open, name])

    // --------------------------------------------------------------
    // form
    // --------------------------------------------------------------

    const formik = useFormik({
        initialValues: initial,
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: (val) => onSubmitFunction(val)
    })

    const { values, errors, touched, handleChange, handleBlur, isSubmitting, isValid, dirty, handleSubmit, handleReset, setFieldValue } = formik

    // --------------------------------------------------------------
    // send
    // --------------------------------------------------------------

    async function onSubmitFunction(val: typeof initial) {
        try {
            const res = type == 'create' ? await functionData[name].add(val) : await functionData[name].update(id as string, val)
            if (res.success) {
                setOpen(false)
                handleReset(initial)
                ToastSuccess(text[name][type].msg)
            }
            if (res.errors) ToastDanger()
        } catch { ToastDanger() }
    }

    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------

    return (
        <>
            <div onClick={() => setOpen(true)}>{children}</div>

            <Drawer open={open} onOpenChange={() => setOpen(false)}>
                <DrawerContent
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <DrawerHeader>
                        <DrawerTitle className="text-2xl text-primary">{text[name][type].title}</DrawerTitle>
                        <DrawerDescription className="text-base">{text[name][type].description}</DrawerDescription>
                    </DrawerHeader>
                    <Separator />
                    <section className={`p-4 overflow-y-auto flex-1 grid gap-4 ${name == "pizza" ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>

                        <div className="space-y-2">
                            <Label className="pl-3">Nome</Label>
                            <Input
                                name="name"
                                placeholder="Nome"
                                onChange={(e) => {
                                    const value = e.target.value
                                    const capitalized = value.charAt(0).toUpperCase() + value.slice(1)
                                    setFieldValue("name", capitalized)
                                }}
                                onBlur={handleBlur}
                                value={values.name}
                                className={errors.name && touched.name ? "custom-form-error" : ""}
                            />
                            {errors.name && touched.name && <p className="text-destructive text-sm pl-3">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="pl-3">Prezzo {name == "pizza" && "base"}</Label>
                            <Input
                                type='number'
                                name="price"
                                placeholder="Prezzo"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.price}
                                className={errors.price && touched.price ? "custom-form-error" : ""}
                            />
                            {errors.price && touched.price && <p className="text-destructive text-sm pl-3">{errors.price}</p>}
                        </div>

                        {name == 'pizza' && (
                            <>
                                <div className="space-y-2">
                                    <Label className="pl-3">Prezzo XL</Label>
                                    <Input
                                        type='number'
                                        name="xl"
                                        placeholder="Prezzo"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.xl}
                                        className={errors.xl && touched.xl ? "custom-form-error" : ""}
                                    />
                                    {errors.xl && touched.xl && <p className="text-destructive text-sm pl-3">{errors.xl}</p>}
                                </div>

                                <div className='lg:col-span-3'>
                                    <section className='bg-input p-4 rounded-xl space-y-3'>
                                        <Label>Ingredienti</Label>
                                        <Separator className="bg-slate-300" />
                                        {allIngredients.map((el, i) => (
                                            <React.Fragment key={i}>
                                                <div
                                                    className="text-base flex items-center gap-2"
                                                    onClick={() => {
                                                        const current = values.ingredients as Ingredient[] || []
                                                        const isChecked = current.some(item => item.name === el.name)

                                                        const updated = isChecked
                                                            ? current.filter(item => item.name !== el.name)
                                                            : [...current, { name: el.name, price: el.price, xl: el.xl }]

                                                        setFieldValue("ingredients", updated)
                                                    }}
                                                >
                                                    <Checkbox
                                                        className="size-5 border border-slate-300 data-[state=checked]:border-primary"
                                                        checked={(values.ingredients as Ingredient[])?.some((item) => item.name === el.name) || false}
                                                    />
                                                    <div className="flex items-center gap-4 justify-between w-full text-xs">
                                                        <span>{el.name}</span>
                                                        <span className='flex items-center gap-2'>
                                                            <span>Base: {el.price}</span>
                                                            <span className='text-primary'>XL: {el.xl}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                                {allIngredients.length !== (i + 1) && <Separator className="bg-slate-300" />}
                                            </React.Fragment>
                                        ))}
                                    </section>
                                </div>
                            </>
                        )}

                    </section>
                    <Separator />
                    <DrawerFooter className="flex lg:items-center justify-end gap-4 lg:flex-row flex-col-reverse">
                        <DrawerClose asChild>
                            <Button className="custom-button max-lg:grow" type='button' variant="destructive">Annulla</Button>
                        </DrawerClose>
                        <Button
                            type='submit'
                            className="custom-button max-lg:grow"
                            disabled={!isValid || !dirty || isSubmitting}
                            onClick={() => handleSubmit()}
                        >
                            {isSubmitting && <Loader2 className="animate-spin" />}
                            {text[name][type].button}
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}