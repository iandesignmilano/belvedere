"use client"

import { useState, useEffect } from "react"

// formik
import { FormikErrors, FormikTouched } from "formik"

// shad
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/datePicker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// icons
import { Loader2, Plus, Minus } from "lucide-react"

// actions
import { getTableFree } from "@/actions/reservations"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

type initialValue = {
    people: number
    date: string | undefined
    time: string
}

interface Step2Props {
    values: initialValue
    errors: FormikErrors<initialValue>
    touched: FormikTouched<initialValue>
    setFieldValue: <K extends keyof initialValue>(field: K, value: initialValue[K], shouldValidate?: boolean) => void
    setFieldTouched: (field: string, touched?: boolean, shouldValidate?: boolean) => void;
    isValid: boolean
    isSubmitting: boolean

    setProgress: React.Dispatch<React.SetStateAction<number>>
    progress: number
}


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Step2({ values, errors, touched, isValid, isSubmitting, setFieldValue, progress, setProgress, setFieldTouched }: Step2Props) {

    // --------------------------------------------------------------
    // data slot
    // --------------------------------------------------------------

    const [slots, setSlots] = useState<string[]>([])

    useEffect(() => {

        async function getSlots() {
            const res = await getTableFree(values.date as string, values.people)
            setSlots(res)
            setFieldValue('time', "")
        }

        if (values.date && values.people) getSlots()
    }, [values.date, values.people, setFieldValue])

    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------


    return (
        <>
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
                            disabled={values.people == 15}
                            onClick={() => {
                                const qta = values.people == 15 ? 15 : values.people + 1
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
                <p className="text-sm pl-3 text-muted-foreground">Oltre 15 persone chiama il numero: 02 241 65 947</p>
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
                        {slots.map((el, i) => <SelectItem key={i} value={el}>{el}</SelectItem>)}
                    </SelectContent>
                </Select>
                {!values.date && <p className="text-sm pl-3 text-muted-foreground">Seleziona una data per vedere gli orari</p>}
                {errors.time && touched.time && <p className="text-red-500 text-sm pl-3">{errors.time}</p>}
            </div>

            <div className="lg:col-span-2 flex gap-4 justify-between max-lg:flex-col-reverse">
                <Button
                    className="custom-button custom-button-outline !text-lg max-lg:w-full"
                    variant="outline"
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setProgress(progress - 1)}
                >
                    Indietro
                </Button>
                <Button
                    type="submit"
                    className="custom-button !text-lg max-lg:w-full bg-green-600 hover:bg-green-600/90"
                    disabled={!isValid || isSubmitting || !values.people || !values.date || !values.time}
                >
                    {isSubmitting && <Loader2 className="size-6 animate-spin" />} Conferma
                </Button>
            </div>
        </>
    )
}