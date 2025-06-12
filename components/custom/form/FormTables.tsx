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
import { getTable, addTableAction, updateTableAction } from '@/actions/tables'

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface FormTablesProps {
    children: React.ReactNode
    type: "create" | "update"
    id?: string
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// type
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const text = {
    create: {
        title: "Aggiungi tavolo",
        description: "Compila i campi sottostanti per aggiungere un nuovo tavolo alla piattaforma.",
        button: "Aggiungi tavolo"
    },
    update: {
        title: "Modifica tavolo",
        description: "Aggiorna le informazioni del tavolo selezionato.",
        button: "Salva modifiche"
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// form 
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const schema = yup.object({
    people: yup
        .string()
        .required("Il numero di persone è obbligatorio")
        .matches(/^\d+$/, "Il numero di persone deve essere un numero intero"),
    total: yup
        .string()
        .required("Il totale è obbligatorio")
        .matches(/^\d+$/, "Il totale deve essere un numero intero"),
})

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function FormTables({ children, type, id }: FormTablesProps) {

    const [open, setOpen] = useState(false)

    const [initial, setInitial] = useState({ people: "", total: "" })

    // --------------------------------------------------------------
    // data (update)
    // --------------------------------------------------------------

    useEffect(() => {
        async function getData() {
            if (id) {
                const data = await getTable(id)
                if (data) setInitial({ people: data.people, total: data.total })
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
            const res = type == 'create' ? await addTableAction(val) : await updateTableAction(id as string, val)
            if (res.success) {
                setOpen(false)
                handleReset(initial)
                ToastSuccess(type == "create" ? "Tavolo aggiunto con successo!" : "Tavolo aggiornato con successo!")
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
                        <DrawerTitle className="text-2xl text-primary">{text[type].title}</DrawerTitle>
                        <DrawerDescription className="text-base">{text[type].description}</DrawerDescription>
                    </DrawerHeader>
                    <Separator />
                    <section className="p-4 overflow-y-auto flex-1 grid lg:grid-cols-2 gap-4">

                        <div className="space-y-2">
                            <Label className="pl-3">Numero di persone</Label>
                            <Input
                                type='number'
                                name="people"
                                placeholder="Numero di persone"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.people}
                                className={errors.people && touched.people ? "custom-form-error" : ""}
                            />
                            {errors.people && touched.people && <p className="text-destructive text-sm pl-3">{errors.people}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="pl-3">Disponibilità</Label>
                            <Input
                                type='number'
                                name="total"
                                placeholder="Disponibilità"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.total}
                                className={errors.total && touched.total ? "custom-form-error" : ""}
                            />
                            {errors.total && touched.total && <p className="text-destructive text-sm pl-3">{errors.total}</p>}
                        </div>
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
                            {text[type].button}
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}