// icon
import { Pizza, Calendar } from "lucide-react"

// components
import MotionText from "../custom/motion/MotionText"
import MotionButton from "../custom/motion/MotionButton"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface BannerProps {
    title: string;
    text: string[];
    bg: string;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// data
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export const buttonsList = [
    {
        link: "/prenota",
        name: "Prenota un tavolo",
        icon: <Calendar />,
        variant: "outline"
    },
    {
        link: "/ordina",
        name: "Ordina ora",
        icon: <Pizza />
    }
]

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Banner({ title, text, bg }: BannerProps) {
    return (
        <section className={`custom-section ${bg}`}>
            <div className="custom-container flex flex-col items-center justify-center text-center gap-8">
                <MotionText title={title} text={text} multitext={true} />
                <div className="flex max-sm:flex-col gap-4 lg:items-center lg:justify-center w-full">
                    <MotionButton buttons={buttonsList} />
                </div>
            </div>
        </section>
    )
}