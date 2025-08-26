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

interface MotionButtonProps {
    buttons: {
        link: string;
        name: string;
        icon: React.ReactNode;
        variant?: string;
    }[]
    className?: string;
    show?: boolean;

}

type buttonVariant = "link" | "outline" | "default" | "destructive" | "secondary" | "ghost" | null | undefined;

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

export default function MotionButton({ buttons, className, show = false }: MotionButtonProps) {

    const isMobile = useIsMobile()

    return (
        <>
            {buttons.map((el, i) => (
                <motion.span
                    key={i}
                    initial={anim.initial}
                    whileInView={anim.whileInView(show ? 0 : (i + 1) * 0.4, isMobile)}
                >
                    <Link href={el.link} className="block">
                        <Button
                            className={`
                                custom-button ${el.variant == "outline" && "custom-button-outline"} 
                                !text-lg max-lg:w-full 
                                ${el.variant !== "outline" && className}
                            `}
                            variant={el.variant as buttonVariant ?? "default"}
                        >
                            {el.icon} {el.name}
                        </Button>
                    </Link>
                </motion.span>
            ))}
        </>
    )
}