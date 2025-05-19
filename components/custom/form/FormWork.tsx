"use client"

// next
import Link from "next/link"

// shad
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

// motion
import { motion } from "motion/react"

// components
import MotionText from "../motion/MotionText"

// hook
import { useIsMobile } from "@/hooks/use-mobile"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// data
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const text = [
    "Stiamo cercando persone sveglie, con voglia di imparare e far parte di una squadra affiatata! Lavoro serale e nei weekend: se ti piace stare in mezzo alla gente, potresti essere la persona giusta."
]

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// transitions
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const anim = {
    initial: { opacity: 0 },
    whileInView: (delay: number, isMobile: boolean) => ({
        opacity: 1,
        transition: {
            duration: 0.5,
            delay: isMobile ? 0 : delay,
            ease: "easeInOut"
        }
    })
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function FormWork() {

    const isMobile = useIsMobile()

    return (
        <section className="custom-section bg-food">
            <div className="custom-container flex flex-col gap-8">
                <MotionText text={text} />
                <motion.p
                    initial={anim.initial}
                    whileInView={anim.whileInView(0, isMobile)}
                >
                    Compila il form qui sotto oppure manda il tuo CV a:&nbsp;
                    <Link
                        href="mailto:infopizzeriabelvedere@gmail.com"
                        className="hover:text-primary custom-transition"
                    >
                        infopizzeriabelvedere@gmail.com
                    </Link>
                </motion.p>
                <motion.form
                    className="grid grid-cols-2 gap-8 mt-8"
                    initial={anim.initial}
                    whileInView={anim.whileInView(0, isMobile)}
                >
                    <div className="space-y-2 col-span-2">
                        <Label className="text-base pl-3">Nome e Cognome</Label>
                        <Input placeholder="Nome e Cognome" />
                    </div>
                    <div className="space-y-2 max-lg:col-span-2">
                        <Label className="text-base pl-3">Email</Label>
                        <Input placeholder="Email" type="mail" />
                    </div>
                    <div className="space-y-2 max-lg:col-span-2">
                        <Label className="text-base pl-3">Telefono</Label>
                        <Input placeholder="Telefono" type="tel" />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label className="text-base pl-3">Curriculum (Max 2mb)</Label>
                        <Input type="file" />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label className="text-base pl-3">Messaggio</Label>
                        <Textarea placeholder="Messaggio" />
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                        <Checkbox className="size-6 bg-input" />
                        <Label className="text-base">Acconsento al trattamento dei miei dati personali secondo l&lsquo;informativa di questo sito.</Label>
                    </div>
                    <div className="col-span-2 text-right">
                        <Button className="custom-button !text-lg max-lg:w-full">Invia CV</Button>
                    </div>
                </motion.form>
            </div>
        </section>
    )
}