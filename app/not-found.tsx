// components
import MotionText from "@/components/custom/motion/MotionText"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// data
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const data = {
    title: "Pagina non trovata",
    text: [
        "La pagina che stai cercando potrebbe essere stata spostata o non esistere più."
    ],
    button: {
        text: "Torna alla home",
        link: "/"
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function NotFound() {
    return (
        <section className="relative bg-food w-full h-full min-h-screen flex items-center justify-center overflow-hidden px-4">
            <div className="relative flex flex-col gap-8 items-center text-center">
                <MotionText {...data} />
            </div>
        </section>
    )
}