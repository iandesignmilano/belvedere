// next
import Link from "next/link"

import { useState, useEffect } from "react"

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
import { Plus, Pizza, Salad, CupSoda, Minus, LoaderCircle } from "lucide-react"

// action
import { getMenu } from "@/actions/menu"
import { getDrinks } from "@/actions/drinks"
import { getOutlines } from "@/actions/outlines"

// interface
import { OrderBase, Ingredient } from "@/actions/orders"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

type singleValue = OrderBase["order"][number]

interface Step1Props {
    values: OrderBase
    errors: FormikErrors<OrderBase>
    touched: FormikTouched<OrderBase>
    setFieldValue: FormikHelpers<OrderBase>["setFieldValue"]
    setFieldTouched: (field: string, touched?: boolean, shouldValidate?: boolean) => void
    setProgress: React.Dispatch<React.SetStateAction<number>>
    progress: number
}

export interface GetDataProps {
    name: string
    price: string
    ingredients?: Ingredient[]
    total_base?: string
    total_xl?: string
    total_xxl?: string
}

export type SelectedData = GetDataProps & { index: number }

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// data
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const getData = {
    pizze: getMenu,
    drinks: getDrinks,
    outline: getOutlines
}

const text = {
    pizze: {
        description: "Seleziona le pizze che vuoi gustare",
        detail: "",
        icon: <Pizza className="size-4" />
    },
    drinks: {
        description: "Scegli le bibite per accompagnare il tuo pasto",
        detail: "Bevanda fresca per ogni gusto",
        icon: <CupSoda className="size-4" />
    },
    outline: {
        description: "Completa il tuo ordine con un contorno sfizioso",
        detail: "Contorno perfetto per arricchire il tuo pasto",
        icon: <Salad className="size-4" />
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Step1({ values, errors, touched, setFieldValue, setFieldTouched, progress, setProgress }: Step1Props) {

    const [updated, setUpdated] = useState(false)

    const [loader, setLoader] = useState(false)

    // --------------------------------------------------------------
    // get data
    // --------------------------------------------------------------

    const [active, setActive] = useState<keyof typeof getData>("pizze")

    const [list, setList] = useState<GetDataProps[]>([])

    useEffect(() => {
        async function fetchData() {
            setLoader(true)
            const res = await getData[active]()
            setList(res)
            setTimeout(() => setLoader(false), 1000)
        }
        fetchData()
    }, [active])

    // --------------------------------------------------------------
    // form data
    // --------------------------------------------------------------

    const form = { values, errors, touched, setFieldValue, setFieldTouched }

    // --------------------------------------------------------------
    // selected
    // --------------------------------------------------------------

    const [selected, setSelected] = useState<SelectedData | null>(null)
    const selected_length = selected ? Object.keys(selected).length : 0

    const resetSelected = () => setSelected(null)

    // --------------------------------------------------------------
    // get
    // --------------------------------------------------------------

    //price
    const getPrice = (index: number) => {
        const element = values.order.find((el) => el.id == index)
        const price = active == "pizze" ? "--" : element?.price
        const total = element?.total || price
        return total == "--" ? "--" : `${total}€`
    }

    // data
    const getSelected = (data: GetDataProps) => {
        setSelected({ ...data, index: values.order.length + 1 })

        let newOrder = {}
        if (active == "pizze") {
            newOrder = {
                id: values.order.length + 1,
                name: data.name,
                ingredients: data.ingredients,
                type: "",
                price: "",
                quantity: 1,
                custom: [],
                removed: [],
                total: "",
                type_list: active
            }
        } else newOrder = { id: values.order.length + 1, name: data.name, type: "base", price: data.price, quantity: 1, total: data.price, type_list: active }

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

    const updateSelected = async (data: singleValue) => {

        const type = data.type_list as "pizze" | "drinks" | "outline"
        setActive(type)

        const res = await getData[type]()
        setList(res)

        const menu = res.find((el) => el.name == data.name)
        if (menu) setSelected({ ...menu, index: data.id as number })
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
    const drawer_title = selected_length === 0 ? "Il tuo ordine" : selected?.name
    const drawer_description = selected_length === 0
        ? text[active].description
        : active == "pizze" && Array.isArray(selected?.ingredients)
            ? (selected?.ingredients as Ingredient[]).map(ing => ing.name).join(", ")
            : text[active].detail

    // --------------------------------------------------------------
    // search
    // --------------------------------------------------------------

    const [search, setSearch] = useState("")

    const filteredList = list.filter(el => {
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
                            <AccordionTrigger className="text-primary text-lg items-center">
                                <span className="flex items-center gap-2">
                                    <span className="block bg-primary text-white p-2 rounded-full">
                                        {text[el.type_list as "pizze" | "drinks" | "outline"].icon}
                                    </span>
                                    {el.quantity} X {el.name} {el.type_list == "pizze" && `- ${el.type.toUpperCase()}`}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4">
                                <Separator className="bg-slate-300" />
                                <p className="text-sm flex items-center justify-between gap-2">
                                    <span className="flex items-center gap-2">
                                        {text[el.type_list as "pizze" | "drinks" | "outline"].icon}
                                        <span>Prezzo</span>
                                    </span>
                                    <span>{(parseFloat(el.price) * el.quantity).toFixed(2).toString()}€</span>
                                </p>

                                {el.removed && el.removed.length > 0 && (
                                    <>
                                        <Separator className="bg-slate-300" />
                                        {el.removed.map((add, i) => {

                                            const price = el.type == "xl" ? add.xl : el.type == "xxl" ? add.xxl : add.price
                                            const total = (parseFloat(price) * el.quantity).toFixed(2).toString()

                                            return (
                                                <div key={i} className="text-sm flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Minus className="size-4 text-red-600" />
                                                        <span>{add.name}</span>
                                                    </div>
                                                    <span>{total}€</span>
                                                </div>
                                            )
                                        })}
                                    </>
                                )}

                                {el.custom && el.custom.length > 0 && (
                                    <>
                                        <Separator className="bg-slate-300" />
                                        {el.custom.map((add, i) => {

                                            const price = el.type == "xl" ? add.xl : el.type == "xxl" ? add.xxl : add.price
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
                                    <span className="flex items-center gap-2">
                                        {text[el.type_list as "pizze" | "drinks" | "outline"].icon}
                                        <span>Totale</span>
                                    </span>
                                    <span>{el.total}€</span>
                                </p>

                                <Separator className="bg-slate-300" />
                                <div className="flex items-center justify-between lg:justify-end gap-4">
                                    <Button
                                        type="button"
                                        className="max-lg:grow rounded-full"
                                        variant="destructive"
                                        onClick={() => deleteSelected(el.id as number)}
                                    >
                                        Elimina
                                    </Button>
                                    <Button
                                        type="button"
                                        className="max-lg:grow rounded-full"
                                        onClick={() => updateSelected(el)}
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
                    {selected_length === 0 && (
                        <>
                            <Separator className="mb-4" />
                            <div className="flex items-center justify-between gap-4 px-4">
                                <Button
                                    className={`rounded-full grow ${active == "pizze" ? "bg-primary border-primary text-white" : "custom-button-outline"}`}
                                    variant="outline"
                                    onClick={() => setActive("pizze")}
                                >
                                    <Pizza /> Pizze
                                </Button>
                                <Button
                                    className={`rounded-full grow ${active == "outline" ? "bg-primary border-primary text-white" : "custom-button-outline"}`}
                                    variant="outline"
                                    onClick={() => setActive("outline")}
                                >
                                    <Salad /> Contorni
                                </Button>
                                <Button
                                    className={`rounded-full grow ${active == "drinks" ? "bg-primary border-primary text-white" : "custom-button-outline"}`}
                                    variant="outline"
                                    onClick={() => setActive("drinks")}
                                >
                                    <CupSoda /> Bibite
                                </Button>
                            </div>
                        </>
                    )}

                    <Separator className="my-4" />

                    {loader && (
                        <div className="text-lg text-primary flex items-center gap-2 px-4">
                            <LoaderCircle className="animate-spin" />
                            Caricamento...
                        </div>
                    )}

                    {!loader && (
                        <section className="space-y-4 px-4 overflow-y-auto flex-1">
                            {selected_length === 0 && <Step1DrawerList list={filteredList} getSelected={getSelected} name={active} />}
                            {selected_length > 0 && selected && <Step1DrawerForm selected={selected} {...form} active={active} />}
                        </section>
                    )}


                    <DrawerFooter className="lg:items-end">
                        {selected_length === 0 && (
                            <DrawerClose asChild onClick={resetSelected}>
                                <Button className="custom-button !text-lg" variant="destructive">Chiudi</Button>
                            </DrawerClose>
                        )}

                        {selected_length > 0 && (
                            <>
                                <div>Totale: {getPrice(selected?.index as number)}</div>
                                <Separator className="my-2" />
                                <section className="flex lg:items-center max-lg:flex-col-reverse gap-4 justify-between">
                                    <Button
                                        className="custom-button custom-button-outline !text-lg"
                                        variant="outline"
                                        onClick={() => updated ? resetUpdate() : deleteSelected(selected?.index as number)}
                                    >
                                        Annulla
                                    </Button>
                                    <DrawerClose asChild onClick={() => setOpen(false)}>
                                        <Button
                                            className="custom-button !text-lg max-lg:grow"
                                            disabled={getDataCheck(selected?.index as number)}
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