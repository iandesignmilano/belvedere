'use client'

import React, { useState, useEffect, useRef } from "react"

// next
import { usePathname } from "next/navigation"
import Link from "next/link"

// shad
import { Button } from "@/components/ui/button"

// motion
import { motion, useScroll, AnimatePresence } from "framer-motion"

// components
import { nav, VariantProps, Navbar } from "@/components/site/Navbar"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function MotionNav() {

    // name
    const pathname = usePathname()

    // scroll
    const { scrollY } = useScroll()

    // visible
    const [visible, setVisible] = useState(true)
    const lastScrollY = useRef(0)

    // box bottom mobile
    const [mobileNav, setMobileNav] = useState(false)

    // class
    const [cls, setCls] = useState("bg-transparent")

    // open
    const [open, setOpen] = useState(false)

    // ---------------------------------------------------
    // change bg color
    // ---------------------------------------------------

    useEffect(() => {
        const handleScroll = () => {

            // scroll position
            const currentY = scrollY.get()

            // mobile nav bottom (50% scroll)
            const isVisible = currentY > 100;
            setMobileNav(isVisible)

            // visible
            setVisible(currentY < lastScrollY.current || currentY < 10)
            lastScrollY.current = currentY

            // class
            const clsScroll = scrollY.get() > 10 ? "bg-white" : "bg-transparent"
            setCls(clsScroll)
        }

        const scrollNav = scrollY.on("change", handleScroll)
        return () => scrollNav()

    }, [scrollY])

    // ---------------------------------------------------
    // hidden
    // ---------------------------------------------------

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden"
            setCls("bg-transparent")
        } else {
            document.body.style.overflow = ""
            const clsScroll = scrollY.get() > 10 ? "bg-white" : "bg-transparent"
            setCls(clsScroll)
        }
    }, [open, scrollY])

    // ---------------------------------------------------
    // code
    // ---------------------------------------------------

    return (
        <>
            {/* nav desktop and mobile */}
            <motion.nav
                animate={{ y: visible ? 0 : -100 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className='w-full z-[100] fixed top-0 py-2 max-lg:px-4'
            >
                <Navbar
                    className={cls}
                    open={open}
                    setOpen={setOpen}
                />
            </motion.nav>

            {/* buttons */}
            <AnimatePresence>
                <motion.section
                    initial={{ y: 100 }}
                    animate={{ y: mobileNav ? 0 : 100 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="lg:hidden fixed bottom-0 w-full py-2 px-4 z-[50]"
                >
                    <div className="bg-white rounded-full py-2 px-4 flex items-center justify-around gap-2">
                        {nav
                            .filter(el => el.button)
                            .map((el, index) => (
                                <Link
                                    href={el.link}
                                    key={index}
                                    title={`Link alla pagina ${el.title}`}
                                    aria-label={`Naviga alla pagina ${el.title}`}
                                    className="block w-full"
                                >
                                    <Button
                                        variant={el.variant as VariantProps}
                                        className={`
                                            w-full custom-button
                                            ${el.variant == 'outline' && "custom-button-outline"}
                                        `}
                                    >
                                        {el.icon} {el.title}
                                    </Button>
                                </Link>
                            )
                            )}
                    </div>
                </motion.section>
            </AnimatePresence>

            {/* nav mobile */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        exit={{ opacity: 0 }}
                        className="w-full bg-primary h-svh fixed top-0 left-0 z-[90] overflow-hidden flex flex-col items-center justify-center gap-16"
                    >
                        {nav
                            .filter((el) => !el.button)
                            .map((el, i) => (
                                <motion.h2
                                    key={i}
                                    initial={{ opacity: 0, y: 100 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: (i + 1) * 0.5, ease: "easeInOut" }}
                                    className={`text-white font-title text-5xl ${pathname == el.link && "pb-2 border-b-2"}`}
                                >
                                    <Link href={el.link} onClick={() => setOpen(false)}>
                                        {el.title}
                                    </Link>

                                </motion.h2>
                            ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}