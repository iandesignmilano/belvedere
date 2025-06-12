// next
import Link from "next/link"

import { useState } from "react"

// formik
import { FormikErrors, FormikTouched, FormikHelpers } from "formik"

// components
import Step1DrawerList from "./Step1DrawerList"
import Step1DrawerForm from "./Step1DrawerForm"

// shad
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"

// icons
import { Plus, Pizza } from "lucide-react"

// data
import { MenuList } from "@/assets/data/menu"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export type initialValue = {
    order: {
        id: number
        name: string
        ingredients: string
        type: string
        price: string
        quantity: number
        custom: {
            name: string
            price: string
            xl: string
        }[]
        total: string
    }[];
}

type singleValue = initialValue["order"][number]

interface Step1Props {
    values: initialValue;
    errors: FormikErrors<initialValue>;
    touched: FormikTouched<initialValue>;
    setFieldValue: FormikHelpers<initialValue>["setFieldValue"];
    setFieldTouched: (field: string, touched?: boolean, shouldValidate?: boolean) => void;

    setProgress: React.Dispatch<React.SetStateAction<number>>;
    progress: number;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Step1({ values, errors, touched, setFieldValue, setFieldTouched, progress, setProgress }: Step1Props) {

    const [updated, setUpdated] = useState(false)

    // --------------------------------------------------------------
    // form data
    // --------------------------------------------------------------

    const form = { values, errors, touched, setFieldValue, setFieldTouched }

    // --------------------------------------------------------------
    // selected
    // --------------------------------------------------------------

    const [selected, setSelected] = useState<Record<string, string | number>>({})
    const selected_length = Object.keys(selected).length

    const resetSelected = () => setSelected({})

    // --------------------------------------------------------------
    // get
    // --------------------------------------------------------------

    //price
    const getPrice = (index: number) => {
        const element = values.order.find((el) => el.id == index)
        const total = element?.total || "--"
        return total == "--" ? "--" : `${total}€`
    }

    // data
    const getSelected = (data: Record<string, string>) => {
        setSelected({ ...data, index: values.order.length + 1 })

        const newOrder = { id: values.order.length + 1, name: data.name, ingredients: data.ingredients, type: "", price: "", quantity: 1, custom: [], total: "" }
        setFieldValue("order", [...values.order, newOrder])
    }

    // check
    const getDataCheck = (index: number) => {
        const data = values.order?.[index - 1]

        const errors_data = errors.order?.[index - 1]
        const errors_element = typeof errors_data === "object" && errors_data !== null ? errors_data : undefined

        const hasErrors = !!errors_element?.type || !!errors_element?.quantity
        const isIncomplete = !data?.type || !data?.quantity

        return isIncomplete || hasErrors
    }

    // --------------------------------------------------------------
    // update
    // --------------------------------------------------------------

    const updateSelected = (data: singleValue) => {
        const menu = MenuList.find((el) => el.name == data.name)
        setSelected({ ...menu, index: data.id })
        setUpdated(true)
        setOpen(true)
    }

    const resetUpdate = () => {
        setUpdated(false)
        setOpen(false)
    }

    // --------------------------------------------------------------
    // delete
    // --------------------------------------------------------------

    const deleteSelected = (index: number) => {
        resetSelected()
        const elements = values.order.filter((el) => el.id !== index)
        setFieldValue("order", elements)
    }

    // --------------------------------------------------------------
    // drawer
    // --------------------------------------------------------------

    const [open, setOpen] = useState(false)
    const drawer_title = selected_length === 0 ? "Il tuo ordine" : selected.name
    const drawer_description = selected_length === 0 ? "Seleziona le pizze che vuoi gustare" : selected.ingredients

    // --------------------------------------------------------------
    // search
    // --------------------------------------------------------------

    const [search, setSearch] = useState("")

    const filteredList = MenuList.filter(el => {
        if (!search.trim()) return true
        return el.name?.toLowerCase().includes(search.toLowerCase())
    })

    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------

    return (
        <>
            {values.order.length > 0 && (
                <Accordion type="single" collapsible className="bg-input rounded-xl px-4 lg:col-span-2">
                    {values.order.map((el, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="border-slate-300">
                            <AccordionTrigger className="text-primary text-lg items-center">{el.quantity} X {el.name} - {el.type.toUpperCase()}</AccordionTrigger>
                            <AccordionContent className="space-y-4">
                                <Separator className="bg-slate-300" />
                                <p className="text-sm flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <Pizza className="size-4" />
                                        <span>Prezzo</span>
                                    </div>
                                    <span>{(parseFloat(el.price) * el.quantity).toFixed(2).toString()}€</span>
                                </p>

                                {el.custom.length > 0 && (
                                    <>
                                        <Separator className="bg-slate-300" />
                                        {el.custom.map((add, i) => {

                                            const price = el.type == "base" ? add.price : add.xl
                                            const total = (parseFloat(price) * el.quantity).toFixed(2).toString()

                                            return (
                                                <div key={i} className="text-sm flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Plus className="size-4 text-green-600" />
                                                        <span>{add.name}</span>
                                                    </div>
                                                    <span>{total}€</span>
                                                </div>
                                            )
                                        })}
                                    </>
                                )}

                                <Separator className="bg-slate-300" />
                                <p className="text-base font-bold flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <Pizza className="size-4" />
                                        <span>Totale</span>
                                    </div>
                                    <span>{el.total}€</span>
                                </p>

                                <Separator className="bg-slate-300" />
                                <div className="flex items-center justify-between lg:justify-end gap-4">
                                    <Button
                                        type="button"
                                        className="max-lg:grow rounded-full"
                                        variant="destructive"
                                        onClick={() => deleteSelected(el.id)}
                                    >
                                        Elimina
                                    </Button>
                                    <Button
                                        type="button"
                                        className="max-lg:grow rounded-full"
                                        onClick={() => {
                                            updateSelected(el)
                                        }}
                                    >
                                        Modifica
                                    </Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}

            <div
                className="text-lg lg:col-span-2"
                onClick={() => {
                    resetSelected()
                    setOpen(true)
                }}
            >
                <div className="custom-form-box">
                    <Plus className="size-8" />
                    <span>Aggiungi all&lsquo;ordine</span>
                </div>
            </div>

            <div className="lg:col-span-2 flex max-lg:flex-col-reverse gap-4 justify-between">
                <Link href="/">
                    <Button className="custom-button !text-lg max-lg:w-full" variant="destructive" type="button">Annulla</Button>
                </Link>
                <Button
                    type="button"
                    className="custom-button !text-lg max-lg:w-full"
                    disabled={values.order.length == 0}
                    onClick={() => setProgress(progress + 1)}
                >
                    Avanti
                </Button>
            </div>

            <Drawer open={open} onOpenChange={() => setOpen(false)}>
                <DrawerContent
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <DrawerHeader>
                        <DrawerTitle className="text-4xl text-primary font-title">{drawer_title}</DrawerTitle>
                        <DrawerDescription className="text-base">{drawer_description}</DrawerDescription>
                        {selected_length === 0 && <Input placeholder="Cerca..." value={search} onChange={(e) => setSearch(e.target.value)} />}
                    </DrawerHeader>
                    <Separator />

                    <section className="space-y-4 px-4 mt-4 overflow-y-auto flex-1">
                        {selected_length === 0 && <Step1DrawerList list={filteredList} getSelected={getSelected} />}
                        {selected_length > 0 && <Step1DrawerForm selected={selected} {...form} />}
                    </section>

                    <DrawerFooter className="lg:items-end">
                        {selected_length === 0 && (
                            <DrawerClose asChild onClick={resetSelected}>
                                <Button className="custom-button !text-lg" variant="destructive">Chiudi</Button>
                            </DrawerClose>
                        )}

                        {selected_length > 0 && (
                            <>
                                <div>Totale: {getPrice(selected.index as number)}</div>
                                <Separator className="my-2" />
                                <section className="flex lg:items-center max-lg:flex-col-reverse gap-4 justify-between">
                                    <Button
                                        className="custom-button custom-button-outline !text-lg"
                                        variant="outline"
                                        onClick={() => updated ? resetUpdate() : deleteSelected(selected.index as number)}
                                    >
                                        Annulla
                                    </Button>
                                    <DrawerClose asChild onClick={() => setOpen(false)}>
                                        <Button
                                            className="custom-button !text-lg max-lg:grow"
                                            disabled={getDataCheck(selected.index as number)}
                                        >
                                            Conferma
                                        </Button>
                                    </DrawerClose>
                                </section>
                            </>
                        )}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}