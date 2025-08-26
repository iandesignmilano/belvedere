'use client'

import { useEffect, useState } from "react"

// formik
import { FormikErrors, FormikTouched } from "formik"

// shad
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/datePicker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// action
import { getBakingFree } from "@/actions/orders"

// interface
import { OrderBase } from "@/actions/orders"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface Step3Props {
    values: OrderBase
    errors: FormikErrors<OrderBase>
    touched: FormikTouched<OrderBase>
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void
    setFieldValue: <K extends keyof OrderBase>(field: K, value: OrderBase[K], shouldValidate?: boolean) => void

    setProgress: React.Dispatch<React.SetStateAction<number>>
    progress: number
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Step3({ values, errors, touched, setFieldValue, progress, setProgress }: Step3Props) {

    // --------------------------------------------------------------
    // data slot
    // --------------------------------------------------------------

    const [slots, setSlots] = useState<string[]>([])

    useEffect(() => {
        async function getSlots() {

            const minimalOrder = values.order.map(item => ({ type: item.type, quantity: item.quantity }))
            const res = await getBakingFree({
                date: values.date as string,
                type: values.type,
                orders: minimalOrder
            })
            setSlots(res)
            setFieldValue('time', "")
        }

        if (values.order && values.date) getSlots()
    }, [values.order, values.date, setFieldValue, values.type])


    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------

    return (
        <>
            <div className="space-y-2">
                <Label className="text-base pl-3">Data prenotazione</Label>
                <DatePicker
                    placeholder="Data prenotazione"
                    onChange={(date) => {
                        setFieldValue('date', date as string)
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
                    onClick={() => setProgress(progress - 1)}
                >
                    Indietro
                </Button>
                <Button
                    type="button"
                    className="custom-button !text-lg max-lg:w-full"
                    disabled={!values.date || !values.time || !!errors.date || !!errors.time}
                    onClick={() => setProgress(progress + 1)}
                >
                    Avanti
                </Button>
            </div>
        </>
    )
}

