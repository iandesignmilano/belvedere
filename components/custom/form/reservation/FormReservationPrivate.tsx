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
import { DatePicker } from "@/components/ui/datePicker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"

// components
import { ToastSuccess, ToastDanger } from "@/components/custom/Toast"

// icons
import { Loader2, Plus, Minus } from "lucide-react"

// actions
import { getReservation, addReservationAction, updateReservationAction } from '@/actions/reservations'

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface FormReservationPrivateProps {
    children: React.ReactNode
    type: "create" | "update"
    id?: string
    user?: string
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// type
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const text = {
    create: {
        title: "Aggiungi prenotazione",
        description: "Compila i campi sottostanti per aggiungere una nuova prenotazione alla piattaforma.",
        button: "Aggiungi prenotazione"
    },
    update: {
        title: "Modifica prenotazione",
        description: "Aggiorna le informazioni della prenotazione selezionata.",
        button: "Salva modifiche"
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// form 
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const schema = yup.object({

    fullname: yup
        .string()
        .required("Nome e Cognome sono obbligatori"),

    email: yup
        .string()
        .required("L'email è obbligatoria")
        .email("Inserisci un'email valida"),

    phone: yup
        .string()
        .required("Il numero di telefono è obbligatorio")
        .matches(/^\+?[0-9\s\-]{7,15}$/, "Inserisci un numero di telefono valido"),

    people: yup
        .number()
        .required("Indica il numero di persone")
        .positive("Minimo 1 persona")
        .min(1, "Minimo 1 persona"),

    date: yup
        .string()
        .required("La data è obbligatoria"),

    time: yup
        .string()
        .required("L'orario è obbligatorio"),
})

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function FormReservationPrivate({ children, type, id, user }: FormReservationPrivateProps) {

    const [open, setOpen] = useState(false)

    const [initial, setInitial] = useState({ fullname: "", email: "", phone: "", people: 2, date: "", time: "" })

    // --------------------------------------------------------------
    // data (update)
    // --------------------------------------------------------------

    useEffect(() => {
        async function getData() {
            if (id) {
                const data = await getReservation(id)
                if (data) setInitial({
                    fullname: data.fullname,
                    email: data.email,
                    phone: data.phone,
                    people: data.people,
                    date: data.date,
                    time: data.time
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
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: (val) => onSubmitFunction(val)
    })

    const { values, errors, touched, handleChange, handleBlur, isSubmitting, isValid, dirty, handleSubmit, handleReset, setFieldTouched, setFieldValue } = formik

    // --------------------------------------------------------------
    // send
    // --------------------------------------------------------------

    async function onSubmitFunction(val: typeof initial) {
        try {
            const res = type == 'create' ? await addReservationAction(val, user) : await updateReservationAction(id as string, val)
            if (res.success) {
                setOpen(false)
                handleReset(initial)
                ToastSuccess(type == "create" ? "Prenotazione aggiunta con successo!" : "Prenotazione aggiornata con successo!")
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
                    <section className="p-4 overflow-y-auto flex-1 grid lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label className="text-base pl-3">Nome e Cognome</Label>
                            <Input
                                disabled={type == "update"}
                                name="fullname"
                                placeholder="Nome e Cognome"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.fullname}
                                className={errors.fullname && touched.fullname ? "custom-form-error" : ""}
                            />
                            {errors.fullname && touched.fullname && <p className="text-destructive text-sm pl-3">{errors.fullname}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-base pl-3">Email</Label>
                            <Input
                                disabled={type == "update"}
                                name="email"
                                placeholder="Email"
                                type="email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                className={errors.email && touched.email ? "custom-form-error" : ""}
                            />
                            {errors.email && touched.email && <p className="text-red-500 text-sm pl-3">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-base pl-3">Telefono</Label>
                            <Input
                                disabled={type == "update"}
                                name="phone"
                                placeholder="Telefono"
                                type="tel"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.phone}
                                className={errors.phone && touched.phone ? "custom-form-error" : ""}
                            />
                            {errors.phone && touched.phone && <p className="text-red-500 text-sm pl-3">{errors.phone}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-base pl-3">Numero di persone</Label>
                            <div className="flex gap-2">
                                <Input
                                    name="people"
                                    type="number"
                                    disabled
                                    value={values.people}
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
                                        disabled={values.people == 1}
                                        onClick={() => {
                                            const qta = values.people == 1 ? 1 : values.people - 1
                                            setFieldValue("people", qta)
                                            setFieldTouched("people", true, true)
                                        }}
                                    >
                                        <Minus className="size-4" />
                                    </Button>
                                </div>
                            </div>
                            {errors.people && touched.people && <p className="text-red-500 text-sm pl-3">{errors.people}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-base pl-3">Data prenotazione</Label>
                            <DatePicker
                                placeholder="Data prenotazione"
                                onChange={(date) => {
                                    setFieldValue('date', date)
                                    setFieldValue('time', "")
                                }}
                                value={values.date}
                                className={errors.date && touched.date ? "custom-form-error" : ""}
                            />
                            {errors.date && touched.date && <p className="text-red-500 text-sm pl-3">{errors.date}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-base pl-3">Orari disponibili</Label>
                            <Select
                                value={values.time}
                                onValueChange={(value) => setFieldValue('time', value)}
                                disabled={!values.date}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Orari disponibili" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="19:30">19:30</SelectItem>
                                    <SelectItem value="20:00">20:00</SelectItem>
                                    <SelectItem value="20:30">20:30</SelectItem>
                                </SelectContent>
                            </Select>
                            {!values.date && <p className="text-sm pl-3 text-muted-foreground">Seleziona una data per vedere gli orari</p>}
                            {errors.time && touched.time && <p className="text-red-500 text-sm pl-3">{errors.time}</p>}
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