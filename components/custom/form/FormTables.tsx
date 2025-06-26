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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"

// components
import { ToastSuccess, ToastDanger } from "../Toast"

// icons
import { Loader2, Plus, Minus, X } from "lucide-react"

// actions
import { getTable, getTables, addTableAction, updateTableAction } from '@/actions/tables'

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

const schema = (names: string[], type: "create" | "update") => yup.object({
    name: yup
        .string()
        .required("Il nome è obbligatorio")
        .test("unique-name", "Questo nome è già presente", value => {
            if (!value || type === "update") return true
            return !names.includes(value)
        }),

    people: yup
        .string()
        .required("Il numero di persone è obbligatorio")
        .matches(/^\d+$/, "Il numero di persone deve essere un numero intero"),

    union: yup
        .string()
        .optional()
        .nullable(),

    max: yup
        .string()
        .nullable()
        .when("union", {
            is: (val: string) => val != null && val !== "",
            then: (schema) => schema.required("Il numero di persona massimo è obbligario"),
            otherwise: (schema) => schema.optional()
        })
})

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function FormTables({ children, type, id }: FormTablesProps) {

    const [open, setOpen] = useState(false)

    const [slots, setSlots] = useState<string[]>([])
    const [names, setNames] = useState<string[]>([])

    const [initial, setInitial] = useState({ people: 2, name: "", union: "", max: "" })

    // --------------------------------------------------------------
    // list tables
    // --------------------------------------------------------------

    useEffect(() => {
        async function getData() {
            const res = await getTables()
            if (res) {
                const names = res.map(item => item.name)
                setNames(names)

                let slots = []
                if (type == "create") slots = res.filter(item => !item.union).map(item => item.name)
                else slots = res.map(item => item.name)
                setSlots(slots)
            }
        }
        getData()
    }, [open, type, id])

    // --------------------------------------------------------------
    // data (update)
    // --------------------------------------------------------------

    useEffect(() => {
        async function getData() {
            if (id) {
                const data = await getTable(id)
                if (data) setInitial({
                    people: data.people,
                    name: data.name,
                    union: data.union,
                    max: data.max
                })
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
        validationSchema: schema(names, type),
        enableReinitialize: true,
        onSubmit: (val) => onSubmitFunction(val)
    })

    const { values, errors, touched, handleChange, handleBlur, isSubmitting, isValid, dirty, handleSubmit, handleReset, setFieldValue, setFieldTouched } = formik

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

            <Drawer
                open={open}
                onOpenChange={(open) => {
                    setOpen(false)
                    if (!open) handleReset({ people: 2, name: "", union: "", max: "" })
                }}
            >
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
                            <Label className="pl-3">Nome tavolo</Label>
                            <Input
                                disabled={type == "update"}
                                name="name"
                                placeholder="Nome tavolo"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                                className={errors.name && touched.name ? "custom-form-error" : ""}
                            />
                            {errors.name && touched.name && <p className="text-destructive text-sm pl-3">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="pl-3">Numero di persone</Label>
                            <div className="flex gap-2">
                                <Input
                                    type='number'
                                    name="people"
                                    placeholder="Numero di persone"
                                    value={values.people}
                                    disabled
                                    className="disabled:opacity-100"
                                />
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        className="h-full !px-4 !text-lg"
                                        onClick={() => {
                                            const qta = values.people + 1
                                            setFieldValue("people", qta)
                                            setFieldTouched("people", true, true)
                                        }}
                                    >
                                        <Plus className="size-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        className="h-full !px-4 !text-lg"
                                        disabled={values.people == 2}
                                        onClick={() => {
                                            const qta = values.people == 2 ? 2 : values.people - 1
                                            setFieldValue("people", qta)
                                            setFieldTouched("people", true, true)
                                        }}
                                    >
                                        <Minus className="size-4" />
                                    </Button>
                                </div>
                            </div>
                            {errors.people && touched.people && <p className="text-destructive text-sm pl-3">{errors.people}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="pl-3">Tavolo componibile</Label>
                            <div className="flex gap-2">
                                <Select
                                    value={values.union}
                                    onValueChange={(value) => {
                                        setFieldValue('union', value)
                                        setFieldValue('max', values.people)
                                    }}
                                    disabled={slots.length == 0 || type == "update"}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Lista tavoli" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {slots.map((el, i) => <SelectItem key={i} value={el}>{el}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {values.union && type == "create" && (
                                    <div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            className="h-full !px-4 !text-lg"
                                            onClick={() => {
                                                setFieldValue("union", "")
                                                setFieldTouched("people", true, true)
                                                setFieldValue("max", "")
                                                setFieldTouched("max", true, true)
                                            }}
                                        >
                                            <X className="size-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                            {errors.union && touched.union && <p className="text-destructive text-sm pl-3">{errors.union}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="pl-3">Totale persone</Label>
                            <div className="flex gap-2">
                                <Input
                                    type='number'
                                    name="max"
                                    placeholder="Totale persone"
                                    value={Number(values.max)}
                                    disabled
                                    className={!values.union ? "" : "disabled:opacity-100"}
                                />
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        className="h-full !px-4 !text-lg"
                                        disabled={!values.union}
                                        onClick={() => {
                                            const qta = Number(values.max) + 1
                                            setFieldValue("max", qta)
                                            setFieldTouched("max", true, true)
                                        }}
                                    >
                                        <Plus className="size-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        className="h-full !px-4 !text-lg"
                                        disabled={Number(values.max) == values.people || !values.union}
                                        onClick={() => {
                                            const qta = Number(values.max) == values.people ? values.people : Number(values.max) - 1
                                            setFieldValue("max", qta)
                                            setFieldTouched("max", true, true)
                                        }}
                                    >
                                        <Minus className="size-4" />
                                    </Button>
                                </div>
                            </div>
                            {!values.union && <p className="text-sm pl-3 text-muted-foreground">Solo con tavolo componibile selezionato</p>}
                            {errors.max && touched.max && <p className="text-destructive text-sm pl-3">{errors.max}</p>}
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