import React, { useState, useEffect, useCallback } from "react"

// shad
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// formik
import { FormikErrors, FormikTouched, FormikHelpers } from "formik"

// interface
import { initialValue } from "./Step1"

// icons
import { Plus, Minus } from "lucide-react"

// action
import { getIngredients } from "@/actions/ingredients"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface Step1DrawerFormProps {
    selected: Record<string, string | number>;
    values: initialValue;
    errors: FormikErrors<initialValue>;
    touched: FormikTouched<initialValue>;
    setFieldValue: FormikHelpers<initialValue>["setFieldValue"];
    setFieldTouched: (field: string, touched?: boolean, shouldValidate?: boolean) => void;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Step1DrawerForm({ selected, values, errors, touched, setFieldValue, setFieldTouched }: Step1DrawerFormProps) {


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
    // index and clear
    // --------------------------------------------------------------

    const index = selected.index as number - 1

    useEffect(() => {
        setFieldTouched(`order[${index}].type`, false)
        setFieldTouched(`order[${index}].quantity`, false)
    }, [selected.index, index, setFieldTouched])

    // --------------------------------------------------------------
    // data
    // --------------------------------------------------------------

    const data = values.order?.[index]

    // error
    const errors_data = errors.order?.[index]
    const errors_element = typeof errors_data === "object" && errors_data !== null ? errors_data : undefined

    // touched
    const touched_data = touched.order?.[index]
    const touched_element = typeof touched_data === "object" && touched_data !== null ? touched_data : undefined

    // total
    const getTotal = useCallback((price: string, qta: number) => {
        const basePrice = parseFloat(price)

        const extras = data.custom || []
        const extrasSum = extras.reduce((sum, item) => {
            const price = parseFloat(item.price) || 0
            return sum + price
        }, 0)

        const total = ((basePrice + extrasSum) * qta).toFixed(2).toString()
        setFieldValue(`order[${index}].total`, total)
    }, [data.custom, setFieldValue, index])

    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------

    return (
        <>
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <Label className="text-base pl-3">Porzione</Label>
                    <Select
                        value={data.type}
                        onValueChange={(value) => {
                            setFieldValue(`order[${index}].type`, value)
                            const price = value == "base" ? selected.price as string : selected.maxi as string
                            setFieldValue(`order[${index}].price`, price)
                            getTotal(price, data.quantity)
                        }}
                        onOpenChange={(open) => {
                            if (!open) setFieldTouched(`order[${index}].type`, true)
                        }}
                    >
                        <SelectTrigger className={`w-full ${errors_element?.type && touched_element?.type && "custom-form-error !text-destructive"}`}>
                            <SelectValue placeholder="Porzione" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="base">Base</SelectItem>
                            <SelectItem value="xl">XL</SelectItem>
                        </SelectContent>
                        {errors_element?.type && touched_element?.type && <p className="text-destructive text-sm pl-3">{errors_element.type}</p>}
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-base pl-3">Quantità</Label>
                    <div className="flex gap-2">
                        <Input type="number" min={1} disabled value={data.quantity} className="disabled:opacity-100" />
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                className="h-full !px-4 !text-lg"
                                onClick={() => {
                                    const qta = data.quantity + 1
                                    setFieldValue(`order[${index}].quantity`, qta)
                                    setFieldTouched(`order[${index}].quantity`, true, true)
                                    getTotal(data.price, qta)
                                }}
                            >
                                <Plus className="size-4" />
                            </Button>
                            <Button
                                type="button"
                                className="h-full !px-4 !text-lg"
                                disabled={data.quantity == 1}
                                onClick={() => {
                                    const qta = data.quantity == 1 ? 1 : data.quantity - 1
                                    setFieldValue(`order[${index}].quantity`, qta)
                                    setFieldTouched(`order[${index}].quantity`, true, true)
                                    getTotal(data.price, qta)
                                }}
                            >
                                <Minus className="size-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    {!data.type && <p className="text-muted-foreground text-sm mb-2">Seleziona la porzione per poter personalizzare</p>}
                    <Accordion
                        type="single"
                        collapsible className="bg-input rounded-xl px-4 lg:col-span-2"
                        disabled={!data.type}
                    >
                        {(selected.ingredients as string).split(",").length > 1 && (
                            <AccordionItem value="item-1" className="border-slate-300">
                                <AccordionTrigger className="text-base">Personalizza</AccordionTrigger>
                                <AccordionContent className="space-y-4">
                                    {(selected.ingredients as string).split(",").map((el, i) => (
                                        <React.Fragment key={i}>
                                            {i == 0 && <Separator className="bg-slate-300" />}
                                            <div className="text-base flex items-center gap-2">
                                                <Checkbox className="size-6 border border-slate-300 data-[state=checked]:border-primary" defaultChecked />
                                                {el}
                                            </div>
                                            {(selected.ingredients as string).split(",").length !== (i + 1) && <Separator className="bg-slate-300" />}
                                        </React.Fragment>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        )}

                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-base">
                                <div className="flex items-center gap-2">
                                    {data.custom.length > 0 && (
                                        <div className="bg-primary text-white p-1 size-6 rounded-full flex items-center justify-center text-xs">
                                            {data.custom.length}
                                        </div>
                                    )}
                                    Ingredienti Extra
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4">
                                {allIngredients.map((el, i) => (
                                    <React.Fragment key={i}>
                                        {i == 0 && <Separator className="bg-slate-300" />}
                                        <div
                                            className="text-base flex items-center gap-2"
                                            onClick={() => {
                                                const custom = data.custom || []
                                                const isChecked = custom.some((item) => item.name === el.name)

                                                let updated = []
                                                if (isChecked) {
                                                    updated = custom.filter((item) => item.name !== el.name)
                                                } else {
                                                    updated = [...custom, { name: el.name, price: el.price }]
                                                }

                                                setFieldValue(`order[${index}].custom`, updated)

                                                const basePrice = parseFloat(data.price)
                                                const extrasSum = updated.reduce((sum, item) => sum + parseFloat(item.price || "0"), 0)
                                                const total = ((basePrice + extrasSum) * data.quantity).toFixed(2).toString()
                                                setFieldValue(`order[${index}].total`, total)
                                            }}
                                        >
                                            <Checkbox
                                                className="size-6 border border-slate-300 data-[state=checked]:border-primary"
                                                checked={data.custom?.some((item) => item.name === el.name) || false}
                                            />
                                            <div className="flex items-center gap-4 justify-between w-full">
                                                <span>{el.name}</span>
                                                <span className="text-primary">+ {el.price}€</span>
                                            </div>
                                        </div>
                                        {allIngredients.length !== (i + 1) && <Separator className="bg-slate-300" />}
                                    </React.Fragment>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

            </div>
            <Separator />
        </>
    )
}