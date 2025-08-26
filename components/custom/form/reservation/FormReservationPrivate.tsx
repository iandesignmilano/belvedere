"use client"

import { useState, useEffect } from 'react'

// formik + yup
import { useFormik } from 'formik'
import * as yup from "yup"

// shad
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { DatePicker } from "@/components/ui/datePicker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"

// date
import { format } from "date-fns"

// components
import { ToastSuccess, ToastDanger } from "@/components/custom/Toast"

// icons
import { Loader2, Plus, Minus } from "lucide-react"

// actions
import { getReservation, addReservationAction, updateReservationAction, getTableFree, getAvailableTables } from '@/actions/reservations'

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

    fullname: yup.string().required("Nome e Cognome sono obbligatori"),

    people: yup
        .number()
        .required("Indica il numero di persone")
        .positive("Minimo 1 persona")
        .min(1, "Minimo 1 persona"),

    date: yup.string().required("La data è obbligatoria"),

    table: yup.string().optional(),

    type: yup.string().optional(),

    time: yup.string().required("L'orario è obbligatorio")
})

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function FormReservationPrivate({ children, type, id, user }: FormReservationPrivateProps) {

    const [open, setOpen] = useState(false)

    const [resType, setResType] = useState("sede")

    const [slots, setSlots] = useState<string[]>([])

    const [freeTables, setFreeTables] = useState<string[]>([])

    const date_now = format(new Date(), "dd-MM-yyyy")

    const [initial, setInitial] = useState({ fullname: "", email: "", phone: "", people: 2, date: date_now, time: "", table: "" })

    // --------------------------------------------------------------
    // data (update)
    // --------------------------------------------------------------

    useEffect(() => {
        async function getData() {
            if (id) {
                const data = await getReservation(id)
                if (data) {
                    setInitial({
                        fullname: data.fullname,
                        email: data.email,
                        phone: data.phone,
                        people: data.people,
                        date: data.date,
                        time: data.time,
                        table: data.table
                    })
                    setResType(data.type)
                }
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
            const res = type == 'create' ? await addReservationAction(val, user, "sede") : await updateReservationAction(id as string, val)
            if (res.success) {
                setOpen(false)
                handleReset(initial)
                ToastSuccess(type == "create" ? "Prenotazione aggiunta con successo!" : "Prenotazione aggiornata con successo!")
            }
            if (res.errors) ToastDanger()
        } catch { ToastDanger() }
    }

    // --------------------------------------------------------------
    // reset on close
    // --------------------------------------------------------------

    useEffect(() => {
        handleReset(initial)
        setSlots([])
        setFreeTables([])
    }, [open, handleReset, initial])

    // --------------------------------------------------------------
    // slots
    // --------------------------------------------------------------

    useEffect(() => {

        async function getSlots() {
            const id_reservation = id ? id : undefined
            const res = await getTableFree(values.date, values.people, id_reservation, resType)
            setSlots(res)
        }

        if (values.date && values.people) getSlots()
    }, [values.date, values.people, setFieldValue, open, id, resType])

    // --------------------------------------------------------------
    // free table
    // --------------------------------------------------------------

    useEffect(() => {

        async function getSlots() {
            const id_reservation = id ? id : undefined
            const res = await getAvailableTables(values.date, values.time, id_reservation)
            setFreeTables(res)
        }

        if (values.date && values.people && values.time) getSlots()
    }, [values.date, values.people, values.time, setFieldValue, open, id])

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
                            <Label className="text-base pl-3">Nome e Cognome</Label>
                            <Input
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
                            <Label className="text-base pl-3">Telefono</Label>
                            <Input
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

                        <div className="space-y-2 lg:col-span-2">
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
                                            setFieldValue('time', "")
                                            setFieldValue('table', "")
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
                                            setFieldValue('time', "")
                                            setFieldValue('table', "")
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
                                    setFieldValue('table', "")
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
                                <SelectTrigger className="w-full" disabled={!values.date}>
                                    <SelectValue placeholder="Orari disponibili" />
                                </SelectTrigger>
                                <SelectContent>
                                    {slots.map((el, i) => <SelectItem key={i} value={el}>{el}</SelectItem>)}
                                    {slots.length == 0 && <SelectItem disabled value="empty">Nessun tavolo disponibile</SelectItem>}
                                </SelectContent>
                            </Select>
                            {type == "update" && <p className="text-sm pl-3 text-muted-foreground">Orario prenotazione attuale: {initial.time}</p>}
                            {errors.time && touched.time && <p className="text-red-500 text-sm pl-3">{errors.time}</p>}
                        </div>

                        {resType !== "online" && (
                            <div className="space-y-2 lg:col-span-2">
                                <Label className="text-base pl-3">Tavoli disponibili</Label>
                                <Accordion type="single" collapsible className="bg-input rounded-xl px-4">
                                    <AccordionItem value="tavoli" className="border-slate-300">
                                        <AccordionTrigger className='text-base'>
                                            {values.table ? values.table : "Tavoli disponibili"}
                                        </AccordionTrigger>
                                        <AccordionContent className="space-y-4">
                                            <Separator className="bg-slate-300" />
                                            {freeTables.map((el, i) => {
                                                const isChecked = values.table?.split(" + ").includes(el)

                                                const handleChange = () => {
                                                    let selected = values.table ? values.table.split(" + ") : []
                                                    if (selected.includes(el)) selected = selected.filter(t => t !== el)
                                                    else selected.push(el)
                                                    setFieldValue("table", selected.join(" + "))
                                                }

                                                return (
                                                    <div key={i} className='flex items-center gap-4'>
                                                        <Checkbox
                                                            checked={isChecked}
                                                            onCheckedChange={handleChange}
                                                            className='size-5 bg-white border-white'
                                                        />
                                                        {el}
                                                    </div>
                                                )
                                            })}
                                            {freeTables.length == 0 && <p>Nessun tavolo disponibile</p>}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                                {!values.time && <p className="text-sm pl-3 text-muted-foreground">Seleziona un orario per vedere i tavoli disponibili</p>}
                                {type == "update" && <p className="text-sm pl-3 text-muted-foreground">Tavoli occupati: {initial.table}</p>}
                                {errors.table && touched.table && <p className="text-red-500 text-sm pl-3">{errors.table}</p>}
                            </div>
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
                            {text[type].button}
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}