import { useState } from "react"

// shad
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"

// icons
import { CreditCard, House, Plus } from "lucide-react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export type initialValue = {

    type: string;
    address: {
        street?: string;
        street_number?: string;
        city?: string;
        cap?: string;
    }

    date: string | undefined;
    time: string;

    fullname: string;
    email: string;
    phone: string;

    order: {
        id: number;
        name: string;
        ingredients: string;
        type: string;
        price: string;
        quantity: number;
        custom: { name: string; price: string; }[];
        total: string;
    }[];

    pay: string;
    success: boolean;
}

interface Step5Props {
    values: initialValue;
    setFieldValue: <K extends keyof initialValue>(field: K, value: initialValue[K], shouldValidate?: boolean) => void;
    setProgress: React.Dispatch<React.SetStateAction<number>>;
    progress: number;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Step5({ values, progress, setProgress, setFieldValue }: Step5Props) {

    // --------------------------------------------------------------
    // type
    // --------------------------------------------------------------

    const type_name: Record<"take_away" | "domicile", string> = {
        take_away: "Asporto",
        domicile: "Domicilio"
    }

    // --------------------------------------------------------------
    // order
    // --------------------------------------------------------------

    const sendOrder = () => {
        if (values.pay == "pay") { }
        else {
            setOpen(false)
            setProgress(progress + 1)
        }
    }

    // --------------------------------------------------------------
    // drawer
    // --------------------------------------------------------------

    const [open, setOpen] = useState(false)

    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------

    return (
        <>
            <div>
                <h3 className="mb-2 text-primary font-title text-4xl">Il tuo ordine</h3>
                <Accordion type="single" collapsible className="bg-input rounded-xl px-4 lg:col-span-2">
                    {values.order.map((el, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="border-slate-300">
                            <AccordionTrigger className="text-primary text-lg items-center">{el.name} X {el.quantity}</AccordionTrigger>
                            <AccordionContent className="space-y-4">
                                <p className="text-muted-foreground text-sm">{el.ingredients}</p>
                                {el.custom.length > 0 && (
                                    <>
                                        <Separator className="bg-slate-300" />
                                        {el.custom.map((add, i) => (
                                            <div key={i} className="text-sm flex items-center gap-2">
                                                <Plus className="size-4 text-green-600" />
                                                <span>{add.name}</span>
                                                <span>{add.price}€</span>
                                            </div>
                                        ))}
                                    </>
                                )}
                                <Separator className="bg-slate-300" />
                                <p className="text-base">Porzione: {el.type}</p>
                                <p className="text-base">Prezzo Porzione: {el.price}€</p>
                                <p className="text-base">Quantità: {el.quantity}</p>
                                <Separator className="bg-slate-300" />
                                <p className="text-base font-bold">Totale: {el.total}€</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            <div>
                <h3 className="mb-2 text-primary font-title text-4xl">Dettagli</h3>
                <Accordion type="single" collapsible className="bg-input rounded-xl px-4 lg:col-span-2">
                    <AccordionItem value="details-1" className="border-slate-300">
                        <AccordionTrigger className="text-primary text-lg items-center">Consegna</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                            <Separator className="bg-slate-300" />
                            <p className="text-base">Consegna: {type_name[values.type as keyof typeof type_name]}</p>
                            {values.type == "domicile" && (
                                <>
                                    <Separator className="bg-slate-300" />
                                    <p className="text-base">Indirizzo: {values.address.street}</p>
                                    <p className="text-base">Numero civico: {values.address.street_number}</p>
                                    <p className="text-base">Cap: {values.address.cap}</p>
                                    <p className="text-base">Città: {values.address.city}</p>
                                </>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="details-2" className="border-slate-300">
                        <AccordionTrigger className="text-primary text-lg items-center">Data e ora</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                            <Separator className="bg-slate-300" />
                            <p className="text-base">Data: {values.date}</p>
                            <p className="text-base">Ora: {values.time}</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="details-3" className="border-slate-300">
                        <AccordionTrigger className="text-primary text-lg items-center">I tuoi dati</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                            <Separator className="bg-slate-300" />
                            <p className="text-base">Nome e Cognome: {values.fullname}</p>
                            <p className="text-base">Telefono: {values.phone}</p>
                            <p className="text-base">Email: {values.email}</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <div className="lg:col-span-2 flex gap-4 justify-between">
                <Button
                    className="custom-button custom-button-outline !text-lg"
                    variant="outline"
                    type="button"
                    onClick={() => setProgress(progress - 1)}
                >
                    Indietro
                </Button>
                <Button
                    type="button"
                    className="custom-button !text-lg max-lg:grow"
                    onClick={() => setOpen(true)}
                >
                    Conferma
                </Button>
            </div>

            <Drawer open={open} onOpenChange={() => setOpen(false)}>
                <DrawerContent onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                    <DrawerHeader>
                        <DrawerTitle className="text-4xl text-primary font-title">Metodo di pagamento</DrawerTitle>
                        <DrawerDescription className="text-base">Pagamento alla consegna o con carta.</DrawerDescription>
                    </DrawerHeader>
                    <Separator />

                    <section className="px-4 mt-4 overflow-y-auto flex-1">
                        <div className="grid lg:grid-cols-2 gap-4">
                            <div
                                className={`custom-form-box ${values.pay == "home" && "custom-form-box-active"}`}
                                onClick={() => setFieldValue("pay", "home")}
                            >
                                <House className="size-8" />
                                <span>Alla consegna</span>
                            </div>
                            <div
                                className={`custom-form-box ${values.pay == "card" && "custom-form-box-active"}`}
                                onClick={() => setFieldValue("pay", "home")}
                            >
                                <CreditCard className="size-8" />
                                <span>Carta</span>
                            </div>
                        </div>
                    </section>

                    <DrawerFooter className="lg:items-end">
                        <Separator className="my-2" />
                        <div className="text-right space-y-2">
                            <div className="text-sm">Totale parziale: 30.00€</div>
                            <div className="text-sm">Spese di spedizione: 9.00€</div>
                            <div className="text-primary text-lg">Totale: 39.00€</div>
                        </div>
                        <Separator className="my-2" />
                        <section className="flex items-center gap-4 justify-between">
                            <DrawerClose asChild onClick={() => setOpen(false)}>
                                <Button className="custom-button custom-button-outline !text-lg" variant="outline">
                                    Annulla
                                </Button>
                            </DrawerClose>
                            <DrawerClose asChild onClick={sendOrder}>
                                <Button
                                    disabled={!values.pay}
                                    className="custom-button !text-lg max-lg:grow bg-green-600 hover:bg-green-600/90"
                                >
                                    {values.pay == "card" ? "Paga ordine" : "Conferma ordine"}
                                </Button>
                            </DrawerClose>
                        </section>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}