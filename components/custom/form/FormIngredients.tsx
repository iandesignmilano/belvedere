"use client"

import { useState, useEffect } from 'react'

// formik + yup
import { useFormik } from 'formik'
import * as yup from "yup"

// shad
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from '@/components/ui/separator'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"

// components
import { ToastSuccess, ToastDanger } from "../Toast"

// icons
import { Loader2 } from "lucide-react"

// actions
import { addIngredientAction, updateIngredientAction, getIngredient } from '@/actions/ingredients'

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface FormIngredientsProps {
    children: React.ReactNode
    type: "create" | "update"
    id?: string
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// type
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const text = {
    create: {
        title: "Aggiungi ingrediente",
        description: "Compila i campi sottostanti per aggiungere un nuovo ingrediente alla piattaforma.",
        button: "Aggiungi ingrediente"
    },
    update: {
        title: "Modifica ingrediente",
        description: "Aggiorna le informazioni dell'ingrediente selezionato.",
        button: "Salva modifiche"
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// form 
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const schema = yup.object({
    name: yup.string().required("Il nome dell'ingrediente è obbligatorio"),
    price: yup
        .string()
        .required("Il prezzo dell'ingrediente è obbligatorio")
        .matches(/^\d+(\.\d{1,2})?$/, "Il prezzo deve essere un numero valido")
})

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function FormIngredients({ children, type, id }: FormIngredientsProps) {

    const [open, setOpen] = useState(false)

    const [initial, setInitial] = useState({ name: "", price: "" })

    // --------------------------------------------------------------
    // data (update)
    // --------------------------------------------------------------

    useEffect(() => {
        async function getData() {
            if (id) {
                const data = await getIngredient(id)
                if (data) setInitial({ name: data.name, price: data.price })
                else ToastDanger()
            }
        }
        getData()
    }, [id, open])

    // --------------------------------------------------------------
    // form
    // --------------------------------------------------------------

    const formik = useFormik({
        initialValues: initial,
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: (val) => onSubmitFunction(val)
    })

    const { values, errors, touched, handleChange, handleBlur, isSubmitting, isValid, dirty, handleSubmit, handleReset } = formik

    // --------------------------------------------------------------
    // send
    // --------------------------------------------------------------

    async function onSubmitFunction(val: typeof initial) {
        try {
            const res = type == 'create' ? await addIngredientAction(val) : await updateIngredientAction(id as string, val)
            if (res.success) {
                setOpen(false)
                handleReset(initial)
                ToastSuccess(type == "create" ? "Ingrediente aggiunto con successo!" : "Ingrediente aggiornato con successo!")
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
                    className="z-[105]"
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <DrawerHeader>
                        <DrawerTitle className="text-2xl text-primary">{text[type].title}</DrawerTitle>
                        <DrawerDescription className="text-base">{text[type].description}</DrawerDescription>
                    </DrawerHeader>
                    <Separator />
                    <section className="p-4 overflow-y-auto flex-1 grid lg:grid-cols-2 gap-4">

                        <div className="space-y-2">
                            <Label className="pl-3">Nome</Label>
                            <Input
                                name="name"
                                placeholder="Nome"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                                className={errors.name && touched.name ? "custom-form-error" : ""}
                            />
                            {errors.name && touched.name && <p className="text-destructive text-sm pl-3">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="pl-3">Prezzo</Label>
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
                    </section>
                    <Separator />
                    <DrawerFooter className="flex items-center justify-end gap-4 flex-row">
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
                            {text[type].button}
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}