"use client"

// next 
import Image from "next/image"
import Link from "next/link"

// motion
import { motion } from "motion/react"

// hook
import { useIsMobile } from "@/hooks/use-mobile"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface MotionBoxProps {
    box: {
        title: string;
        subtitle: string;
        text: string;
        image: {
            path: string;
            alt: string;
        }
    }[];
}

interface MotionIconBoxProps {
    box: {
        text?: string | string[];
        icon: React.ReactNode;
        name: string;
        link?: {
            link: string;
            text: string;
            blank?: boolean;
        }
    }[];
    footer?: boolean;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// transitions
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const anim = {
    initial: { opacity: 0, y: 50 },
    whileInView: (delay: number, isMobile: boolean) => ({
        opacity: 1,
        y: 0,
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

export function MotionBox({ box }: MotionBoxProps) {

    const isMobile = useIsMobile()

    return (
        <>
            {box.map((el, i) => (
                <motion.section
                    initial={anim.initial}
                    whileInView={anim.whileInView(i * 0.2, isMobile)}
                    key={i}
                    className="flex flex-col justify-center items-center text-center gap-4"
                >
                    <div className="rounded-full shadow-2xl shadow-primary">
                        <Image
                            src={el.image.path}
                            alt={el.image.alt}
                            width={200}
                            height={200}
                            className="rounded-full"
                        />
                    </div>
                    <h3 className="font-title text-5xl text-primary mt-8">{el.title}</h3>
                    <h5 className="font-bold text-lg">{el.subtitle}</h5>
                    <p>{el.text}</p>
                </motion.section>
            ))}
        </>
    )
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export function MotionIconBox({ box, footer = false }: MotionIconBoxProps) {

    const isMobile = useIsMobile()

    return (
        <>
            {box.map((el, i) => (
                <motion.section
                    initial={anim.initial}
                    whileInView={anim.whileInView(i * 0.2, isMobile)}
                    key={i}
                    className={`${!footer && "flex items-center gap-4 flex-col justify-center text-center"}`}
                >
                    {!footer && (
                        <div className="text-center space-y-4">
                            <div className="inline-block text-white bg-primary p-6 rounded-full">
                                {el.icon}
                            </div>
                            <div className="space-y-4">
                                <p className="text-primary font-title text-5xl">{el.name}</p>
                                <h4 className="text-lg lg:text-xl">
                                    {el.text}
                                    {el.link && (
                                        <Link href={el.link.link} className="hover:text-primary custom-transition">
                                            {el.link.text}
                                        </Link>
                                    )}
                                </h4>
                            </div>
                        </div>
                    )}

                    {footer && (
                        <div className="flex items-center gap-4">
                            <div className="block text-white bg-primary p-4 rounded-full shadow-2xl shadow-primary">
                                {el.icon}
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">{el.name}</p>
                                <h4 className="text-base lg:text-xl">
                                    {!Array.isArray(el.text) && el.text}
                                    {el.link && (
                                        <Link href={el.link.link} className="hover:text-primary custom-transition" target={el.link.blank ? "_blank" : undefined}>
                                            {el.link.text}
                                        </Link>
                                    )}
                                    {Array.isArray(el?.text) && (
                                        el.text.map((single, i) => (
                                            <span
                                                key={i}
                                                className={`block ${el.text && i !== el.text.length - 1 && 'mb-1'}`}
                                            >
                                                {single}
                                            </span>
                                        ))
                                    )}
                                </h4>
                            </div>
                        </div>
                    )}
                </motion.section>
            ))}
        </>
    )
}