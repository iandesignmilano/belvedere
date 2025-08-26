"use client"

import { useState, useEffect } from "react"

// shad
import { Progress } from "@/components/ui/progress"
import { Toaster } from "@/components/ui/sonner"

// components
import FormReservation from "@/components/custom/form/reservation/FormReservation"

// confetti
import confetti from 'canvas-confetti'

// motion
import MotionText from "@/components/custom/motion/MotionText"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// data
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const data = [
    {
        title: "Prenota un tavolo",
        text: ["Inserisci i tuoi dati qui sotto per completare la prenotazione del tavolo"]
    },
    {
        title: "Quando e con chi?",
        text: ["Seleziona il numero di persone e scegli un orario disponibile"]
    },
    {
        title: "Confermata!",
        text: [
            "Grazie! La tua prenotazione è stata registrata con successo. Ti aspettiamo!",
            "Controlla la tua mail: troverai il codice della prenotazione e le istruzioni per eventuali disdette"
        ],
        button: {
            text: "Torna alla home",
            link: "/"
        }
    },
]

const progressBar = [0, 50, 100]

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function ReservationPage({ stop, gap }: { stop: boolean; gap: number }) {

    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (progress == progressBar.length - 1) confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#055ca5'] })
    }, [progress])

    const stopTitle = "Prenotazioni online"
    const stopText = ["Al momento le prenotazioni online non sono disponibili. Per informazioni: 02 241 65 947"]
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
                            key={progress}
                            title={stop ? stopTitle : data[progress].title}
                            text={stop ? stopText : data[progress].text}
                            button={stop ? stopButton : data[progress].button}
                        />

                        {progress < 2 && !stop && (
                            <>
                                <Progress className="h-3" value={progressBar[progress]} />
                                <FormReservation progress={progress} setProgress={setProgress} gap={gap} />
                            </>
                        )}
                    </div>
                </div>
            </section>
            <Toaster />
        </>
    )
}