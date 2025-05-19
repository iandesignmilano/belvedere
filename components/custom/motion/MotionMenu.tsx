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
        name: string;
        ingredients: string;
        price: string;
        maxi?: string;
    }[]
    small?: boolean;
    teglie?: boolean;
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

export default function MotionMenu({ menu, small = false, teglie = false }: MotionMenuProps) {

    const isMobile = useIsMobile()

    const list = small ? menu.slice(0, 7) : menu

    return (
        <>
            {!teglie && (
                <motion.div
                    initial={anim.initial}
                    whileInView={anim.whileInView(0, isMobile)}
                    className="flex justify-end gap-8"
                >
                    <p className="w-[49.69px] lg:w-[55.17px] text-center font-title text-lg lg:text-2xl">BASE</p>
                    <p className="w-[49.69px] lg:w-[55.17px] text-center text-primary font-title text-lg lg:text-2xl">XL</p>
                </motion.div>
            )}

            {list.map((el, i) => (
                <motion.div
                    initial={anim.initial}
                    whileInView={anim.whileInView(0, isMobile)}
                    key={i}
                >
                    <div className="flex items-center justify-between gap-2 lg:gap-4">
                        <h4 className="text-lg lg:text-2xl text-primary">{el.name}</h4>
                        <div className="border border-dashed border-slate-300 grow" />
                        {el.maxi && (
                            <div className="text-lg lg:text-xl flex items-center gap-8">
                                <p>{el.price}€</p>
                                <p className="text-primary">{el.maxi}€</p>
                            </div>
                        )}
                        {!el.maxi && <p className="text-lg lg:text-xl">{el.price}€</p>}
                    </div>
                    <p className="text-slate-600 max-lg:text-sm">{el.ingredients}</p>
                </motion.div>
            ))}
        </>
    )
}