"use client"

import { useState } from "react"

// next
import Link from "next/link"

// shad
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"

// icons
import { Cookie } from "lucide-react"

// motion
import { motion, useScroll, useTransform } from "motion/react"

// actions
import { saveCookiePreferences } from "@/actions/cookie"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function CookieBanner({ show }: { show: boolean }) {

    // banner
    const [banner, setBanner] = useState(show ?? true)

    // preferences
    const [preferences, setPreferences] = useState({ analytics: false, marketing: false })

    // ---------------------------------------------------
    // motion
    // ---------------------------------------------------

    const { scrollY } = useScroll()
    const opacity = useTransform(scrollY, [0, 200], [0, 1])
    const x = useTransform(scrollY, [0, 200], [100, 0])

    // ---------------------------------------------------
    // cookie
    // ---------------------------------------------------

    const handleAcceptAll = async () => {
        await saveCookiePreferences({ necessary: true, analytics: true, marketing: true })
        setBanner(false)
    }

    const handleRejectAll = async () => {
        await saveCookiePreferences({ necessary: true, analytics: false, marketing: false })
        setBanner(false)
    }

    const handleSaveCustom = async () => {
        await saveCookiePreferences({ necessary: true, ...preferences })
        setBanner(false)
    }

    // ---------------------------------------------------
    // code
    // ---------------------------------------------------

    return (
        <section className='fixed bottom-20 lg:bottom-4 end-4 z-50'>
            <Drawer open={banner} onClose={() => setBanner(false)}>
                <DrawerTrigger asChild>
                    <motion.div style={{ opacity, x }} transition={{ duration: 0.5, ease: "easeInOut" }}>
                        <Button className="rounded-full" size="icon" onClick={() => setBanner(true)}>
                            <Cookie />
                        </Button>
                    </motion.div>
                </DrawerTrigger>
                <DrawerContent
                    className="z-[105]"
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <DrawerHeader>
                        <DrawerTitle className='flex items-center gap-2'>
                            <Cookie className='size-6' /> Privacy e Cookie policy
                        </DrawerTitle>
                        <DrawerDescription>
                            Noi e terze parti selezionate utilizziamo cookie o tecnologie simili per finalità tecniche e,
                            con il tuo consenso, anche per altre finalità come specificato nella &nbsp;
                            <Link href='/cookie-policy' className='text-primary' target='_blank'>Cookie Policy</Link>.
                            Usa il pulsante “Accetta” per acconsentire. Usa il pulsante “Rifiuta” o chiudi questa informativa per continuare senza accettare.
                        </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter className='flex lg:items-center justify-between md:!flex-row flex-col-reverse gap-4'>
                        <div>
                            <Drawer>
                                <DrawerTrigger asChild>
                                    <Button className="custom-button custom-button-outline max-md:w-full" variant="outline">Personalizza</Button>
                                </DrawerTrigger>
                                <DrawerContent
                                    className="z-[105]"
                                    onInteractOutside={(e) => e.preventDefault()}
                                    onEscapeKeyDown={(e) => e.preventDefault()}
                                >
                                    <DrawerHeader>
                                        <DrawerTitle>Le tue preferenze relative al consenso per le tecnologie di tracciamento</DrawerTitle>
                                        <DrawerDescription asChild>
                                            <section className='flex flex-col gap-4'>
                                                <div>
                                                    Le opzioni disponibili in questa sezione ti permettono di personalizzare le preferenze relative al consenso per qualsiasi tecnologia di tracciamento utilizzata per le finalità descritte di seguito. Per ottenere ulteriori informazioni in merito all&rsquo;utilità e al funzionamento di tali strumenti di tracciamento, fai riferimento alla <Link className='text-primary' href='/cookie-policy' target='_blank'>Cookie Policy</Link>.
                                                    Tieni presente che il rifiuto del consenso per una finalità particolare può rendere le relative funzioni non disponibili.
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <Switch checked disabled /> Cookie necessari
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <Switch
                                                        checked={preferences.analytics}
                                                        onCheckedChange={(checked) => setPreferences({ ...preferences, analytics: checked })}
                                                    /> Cookie analitici
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <Switch
                                                        checked={preferences.marketing}
                                                        onCheckedChange={(checked) => setPreferences({ ...preferences, marketing: checked })}
                                                    /> Cookie di marketing
                                                </div>
                                            </section>
                                        </DrawerDescription>
                                    </DrawerHeader>
                                    <DrawerFooter className='flex lg:items-center justify-between md:!flex-row flex-col-reverse gap-4'>
                                        <div>
                                            <DrawerClose asChild>
                                                <Button className="custom-button custom-button-outline max-lg:w-full" variant="outline">Annulla</Button>
                                            </DrawerClose>
                                        </div>
                                        <div className='text-end'>
                                            <DrawerClose asChild>
                                                <Button className="custom-button max-lg:w-full" onClick={handleSaveCustom}>Salva e continua</Button>
                                            </DrawerClose>
                                        </div>
                                    </DrawerFooter>
                                </DrawerContent>
                            </Drawer>
                        </div>
                        <section className='flex gap-4 justify-end max-md:flex-col-reverse'>
                            <DrawerClose asChild>
                                <Button
                                    className="custom-button custom-button-outline"
                                    variant="outline"
                                    onClick={handleRejectAll}
                                >
                                    Rifiuta
                                </Button>
                            </DrawerClose>
                            <DrawerClose asChild>
                                <Button className="custom-button" onClick={handleAcceptAll}>Accetta</Button>
                            </DrawerClose>
                        </section>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </section>
    )
}