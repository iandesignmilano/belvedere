// shad
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// icons
import { Plus } from "lucide-react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export type initialValue = {
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
}

interface Step5Props {
    values: initialValue;

    setProgress: React.Dispatch<React.SetStateAction<number>>;
    progress: number;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Step5({ values, progress, setProgress }: Step5Props) {
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
                        <AccordionContent className="space-y-4"></AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="details-2" className="border-slate-300">
                        <AccordionTrigger className="text-primary text-lg items-center">Data e ora</AccordionTrigger>
                        <AccordionContent className="space-y-4"></AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="details-3" className="border-slate-300">
                        <AccordionTrigger className="text-primary text-lg items-center">I tuoi dati</AccordionTrigger>
                        <AccordionContent className="space-y-4"></AccordionContent>
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
                    className="custom-button !text-lg max-lg:grow bg-green-600 hover:bg-green-600/90"
                // onClick={() => setProgress(progress + 1)}
                >
                    Conferma
                </Button>
            </div>
        </>
    )
}