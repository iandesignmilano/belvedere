"use client"

// next
import Link from "next/link"

// shad
import { Button } from "@/components/ui/button"

// motion
import { motion } from "motion/react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface MotionIntroProps {
    name: string;
    text: string;
    table: {
        name: string;
        link: string;
        icon: React.ReactNode;
    }
    order: {
        name: string;
        link: string;
        icon: React.ReactNode;
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// transitions
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const anim = {
    initial: { opacity: 0, y: 20 },
    whileInView: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            delay: delay,
            ease: "easeInOut"
        }
    })
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function MotionIntro({ name, text, table, order }: MotionIntroProps) {
    return (
        <div className="custom-absolute">
            <motion.h1
                initial={anim.initial}
                whileInView={anim.whileInView(0)}
                className="custom-title font-title"
            >
                {name}
            </motion.h1>

            <motion.p
                initial={anim.initial}
                whileInView={anim.whileInView(0.4)}
                className="text-lg"
            >
                {text}
            </motion.p>

            <div className="flex max-lg:flex-col gap-4 w-full">
                <motion.div
                    initial={anim.initial}
                    whileInView={anim.whileInView(0.8)}
                >
                    <Link href={table.link}>
                        <Button variant="outline" className="custom-button custom-button-outline !text-lg max-lg:w-full">
                            {table.icon} {table.name}
                        </Button>
                    </Link>
                </motion.div>
                <motion.div
                    initial={anim.initial}
                    whileInView={anim.whileInView(1.2)}
                >
                    <Link href={order.link}>
                        <Button variant="default" className="custom-button !text-lg max-lg:w-full">
                            {order.icon} {order.name}
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}