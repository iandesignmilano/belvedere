"use client"

import { useState, useEffect } from "react"

// next
import Image from "next/image"

// motion
import { motion, AnimatePresence } from "framer-motion"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function MotionLoader({ children }: { children: React.ReactNode; }) {

    // loader init
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 3000)
        return () => clearTimeout(timer)
    }, [loading])

    return (
        <>
            <AnimatePresence>
                {loading && (
                    <motion.section
                        key="loader"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="custom-section h-svh bg-food flex items-center justify-center fixed inset-0 z-[100]"
                    >
                        <div className="relative">
                            <Image
                                priority
                                src="/logo.png"
                                alt=""
                                width={300}
                                height={181}
                                className="animate-pulse"
                            />
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            {!loading && (
                <motion.main
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    {children}
                </motion.main>
            )}
        </>
    )

}