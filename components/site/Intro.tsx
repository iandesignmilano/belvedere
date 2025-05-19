// next
import Image from "next/image"

// icon
import { Pizza, Calendar } from "lucide-react"

// components
import MotionIntro from "../custom/motion/MotionIntro"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// data
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const data = {
    name: "Pizzeria Belvedere",
    text: "Impasti leggeri, cottura perfetta, atmosfera familiare. Questa è la nostra ricetta.",
    table: {
        name: "Prenota un tavolo",
        link: "/prenota",
        icon: <Calendar />
    },
    order: {
        name: "Ordina ora",
        link: "/ordina",
        icon: <Pizza />
    },
    image: {
        path: "/intro.webp",
        alt: ""
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Intro() {
    return (
        <section className="relative w-full h-full overflow-hidden">
            <MotionIntro
                name={data.name}
                text={data.text}
                order={data.order}
                table={data.table}
            />
            <div className="custom-opacity">
                <Image
                    src="/intro.webp"
                    alt=""
                    width={1920}
                    height={1280}
                    className="w-full h-svh object-cover object-right"
                    priority
                />
            </div>
        </section>
    )
}