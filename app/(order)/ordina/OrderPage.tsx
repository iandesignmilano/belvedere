"use client"

import { useState, useEffect } from "react"

// shad
import { Progress } from "@/components/ui/progress"
import { Toaster } from "@/components/ui/sonner"

// components
import FormOrder from "@/components/custom/form/order/FormOrder"

// confetti
import confetti from 'canvas-confetti'

// motion
import MotionText from "@/components/custom/motion/MotionText"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// data
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const data = [
    {
        title: "Scegli dal menu",
        text: ["Aggiungi i tuoi piatti preferiti e personalizzali come vuoi"]
    },
    {
        title: "Modalità di consegna",
        text: ["Scegli se preferisci ritirare in sede o ricevere l’ordine a domicilio"]
    },
    {
        title: "Quando vuoi riceverlo",
        text: ["Scegli la data e l’orario più comodi per ricevere o ritirare il tuo ordine"]
    },
    {
        title: "I tuoi dati",
        text: ["Inserisci i tuoi dati per completare l’ordine"]
    },
    {
        title: "Riepilogo ordine",
        text: ["Controlla il tuo ordine e assicurati che tutto sia corretto prima di confermare"]
    },
    {
        title: "Ordine confermato",
        text: ["Riceverai una email con il riepilogo dell’ordine e un codice da mostrare al fattorino al momento della consegna"],
        button: {
            text: "Torna alla home",
            link: "/"
        }
    }
]

const progressBar = [0, 20, 40, 60, 80, 100]

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function OrderPage({ stop }: { stop: boolean }) {

    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (progress == progressBar.length - 1) confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#055ca5'] })
    }, [progress])

    const stopTitle = "Ordini online"
    const stopText = ["Al momento gli ordini online non sono disponibili. Per informazioni: 02 241 65 947"]
    const stopButton = {
        text: "Torna alla home",
        link: "/"
    }

    return (
        <>
            <section className="relative py-10 lg:py-20 overflow-hidden bg-food min-h-svh flex flex-col items-center justify-center">
                <div className="custom-container xl:px-60">
                    <div className="flex flex-col gap-8 text-center">
                        <MotionText
                            animate
                            title={stop ? stopTitle : data[progress].title}
                            text={stop ? stopText : data[progress].text}
                            button={stop ? stopButton : data[progress].button}
                        />

                        {progress !== progressBar.length - 1 && !stop && (
                            <>
                                <Progress className="h-3" value={progressBar[progress]} />
                                <FormOrder progress={progress} setProgress={setProgress} />
                            </>
                        )}
                    </div>
                </div>
            </section >
            <Toaster />
        </>
    )
}