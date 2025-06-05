"use client"

// next 
import Link from "next/link"

// motion
import { motion } from "motion/react"

// shad
import { Button } from "@/components/ui/button"

// hook
import { useIsMobile } from "@/hooks/use-mobile"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface MotionTextProps {
    title?: string | null
    text?: string[]
    multitext?: boolean
    button?: {
        text: string
        link: string
        className?: string
    } | null
    animate?: boolean
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// transitions
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const anim = {
    initial: { opacity: 0 },
    animate: (delay: number, isMobile: boolean) => ({
        opacity: 1,
        transition: {
            duration: 0.5,
            delay: isMobile ? 0 : delay,
            ease: "easeInOut"
        }
    }),
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

export default function MotionText({ title, text, multitext = false, button, animate = false }: MotionTextProps) {

    const isMobile = useIsMobile()

    return (
        <>
            {title && (
                <motion.h2
                    key={title}
                    initial={anim.initial}
                    animate={animate ? anim.animate(0, isMobile) : undefined}
                    whileInView={animate ? undefined : anim.whileInView(0, isMobile)}
                    className="custom-title font-title"
                >
                    {title}
                </motion.h2>
            )}

            {text && !multitext && text.map((single, index) => (
                <motion.p
                    key={index}
                    initial={anim.initial}
                    className="text-lg"
                    animate={animate ? anim.animate((index + 1) * 0.2, isMobile) : undefined}
                    whileInView={animate ? undefined : anim.whileInView((index + 1) * 0.2, isMobile)}
                >
                    {single}
                </motion.p>
            ))}

            {text && multitext && (
                <motion.p
                    initial={anim.initial}
                    className="text-lg"
                    animate={animate ? anim.animate(0.2, isMobile) : undefined}
                    whileInView={animate ? undefined : anim.whileInView(0.2, isMobile)}
                >
                    {text[0]}
                    {text[1] && <br className="max-lg:hidden" />}
                    {text[1]}
                </motion.p>
            )}

            {button && (
                <motion.div
                    initial={anim.initial}
                    animate={animate ? anim.animate(text ? text.length * 0.4 : 0.2, isMobile) : undefined}
                    whileInView={animate ? undefined : anim.whileInView(text ? text.length * 0.4 : 0.2, isMobile)}
                    className={`max-lg:w-full ${button.className}`}
                >
                    <Link href={button.link}>
                        <Button className="custom-button max-lg:w-full">{button.text}</Button>
                    </Link>
                </motion.div>
            )}
        </>
    )
}