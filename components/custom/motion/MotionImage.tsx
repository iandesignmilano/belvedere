"use client"

// next 
import Image from "next/image";

// motion
import { motion } from "motion/react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface MotionImageProps {
    images: {
        path: string;
        alt: string;
    }[];
    menu?: boolean;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// transitions
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const anim = {
    initial: (y: number) => ({ opacity: 0, y: y }),
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

export default function MotionImage({ images, menu = false }: MotionImageProps) {
    return (
        <>
            {images.map((el, i) => (
                <motion.div
                    initial={anim.initial(menu ? 0 : i == 0 ? 20 : -20)}
                    whileInView={anim.whileInView(!menu ? 0 : i * 0.1)}
                    className={`rounded-2xl shadow-2xl shadow-primary ${menu && i == 0 && "col-span-2"}`}
                    key={i}
                >
                    <Image
                        src={el.path}
                        alt={el.alt}
                        width={800}
                        height={menu && i == 0 ? 533 : 1067}
                        className={`rounded-2xl ${menu ? null : i == 0 ? "-mt-8" : "mt-8"}`}
                    />
                </motion.div>
            ))}
        </>
    )
}