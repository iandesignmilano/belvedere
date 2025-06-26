"use client"

// motion
import { motion } from "motion/react"

// hook
import { useIsMobile } from "@/hooks/use-mobile"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface MotionMenuProps {
    menu: {
        name: string
        ingredients: {
            name: string
        }[]
        total_base: string
        total_xl: string
    }[]
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// transitions
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const anim = {
    initial: { opacity: 0, y: 20 },
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

export default function MotionMenu({ menu }: MotionMenuProps) {

    const isMobile = useIsMobile()

    return (
        <>
            <motion.div
                initial={anim.initial}
                whileInView={anim.whileInView(0, isMobile)}
                className="flex justify-end gap-8"
            >
                <p className="w-[49.69px] lg:w-[55.17px] text-center font-title text-lg lg:text-2xl">BASE</p>
                <p className="w-[49.69px] lg:w-[55.17px] text-center text-primary font-title text-lg lg:text-2xl">XL</p>
            </motion.div>

            {menu.map((el, i) => (
                <motion.div
                    initial={anim.initial}
                    whileInView={anim.whileInView(0, isMobile)}
                    key={i}
                >
                    <div className="flex items-center justify-between gap-2 lg:gap-4">
                        <h4 className="text-lg lg:text-2xl text-primary">{el.name}</h4>
                        <div className="border border-dashed border-slate-300 grow" />
                        <div className="text-lg lg:text-xl flex items-center gap-8">
                            <p>{el.total_base}€</p>
                            <p className="text-primary">{el.total_xl}€</p>
                        </div>
                    </div>
                    <p className="text-slate-600 max-lg:text-sm">
                        {el.ingredients.map(ing => ing.name).join(", ")}
                    </p>
                </motion.div>
            ))}
        </>
    )
}