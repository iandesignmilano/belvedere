// components
import MotionText from "../custom/motion/MotionText"
import MotionImage from "../custom/motion/MotionImage"
import { MotionBox } from "../custom/motion/MotionBox"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// data
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const dataAbout = {
    title: "Chi siamo",
    text: [
        "Fondata nei primi anni 2000, la Pizzeria Belvedere nasce dal sogno di portare a Senago un luogo dove sentirsi a casa, con il profumo del forno a legna e il sapore autentico della pizza tradizionale.",

        "Anno dopo anno, abbiamo unito esperienza, ingredienti di qualità e passione per l’ospitalità, diventando un punto di riferimento per chi cerca un momento semplice ma speciale da condividere a tavola."
    ],
    images: [
        { path: "/pages/home-locale-1.jpg", alt: "" },
        { path: "/pages/home-locale-1.jpg", alt: "" }
    ],
    button: {
        text: "Scopri la nostra storia",
        link: "/chi-siamo"
    }
}

const dataQuality = {
    title: "Trancio perfetto",
    text: [
        "Il nostro trancio nasce da scelte precise: ingredienti eccellenti, lavorati con cura e passione.",
        "Ogni morso racconta il gusto autentico di una pizza fatta come si deve."
    ],
    box: [
        {
            title: "Farina d’eccellenza",
            subtitle: "La scelta giusta per un impasto perfetto",
            text: "Selezionata tra le migliori in Italia, questa farina garantisce un impasto leggero, digeribile e fragrante. Una base perfetta per un trancio che non stanca mai.",
            image: { path: "/pages/home-box-1.webp", alt: "" }
        },
        {
            title: "Ingredienti scelti",
            subtitle: "Solo il meglio, come da tradizione",
            text: "Dai pelati campani alle mozzarelle fresche dei caseifici cremonesi, fino agli affettati e alle verdure del mercato locale: ogni ingrediente racconta una storia di gusto e autenticità.",
            image: { path: "/pages/home-box-2.webp", alt: "" }
        },
        {
            title: "Passione artigianale",
            subtitle: "Il sapere di chi fa le cose con il cuore",
            text: "Dietro ogni trancio c’è la cura di mani esperte, l’amore per la tradizione e l’impegno costante a offrire un’esperienza sempre all’altezza delle aspettative.",
            image: { path: "/pages/home-box-3.webp", alt: "" }
        }
    ]
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// about
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export function About({ page }: { page?: boolean }) {

    const text = [...dataAbout.text]
    if (page) {
        text.push(
            "Ogni giorno lavoriamo con cura per offrire un'esperienza che va oltre il semplice pasto: un’atmosfera familiare, un sorriso sincero, un impasto che lievita lentamente come vuole la tradizione.",
            "Dalla classica Margherita alle nostre proposte più creative, ogni pizza racconta la nostra storia fatta di scelte autentiche, amore per il mestiere e rispetto per ciò che portiamo in tavola."
        )
    }

    return (
        <section className="custom-section bg-food">
            <div className="custom-container flex flex-col-reverse xl:grid xl:grid-cols-2 items-center gap-16">
                <div className="flex flex-col gap-8">
                    <MotionText
                        title={!page ? dataAbout.title : null}
                        text={text}
                        button={!page ? { text: dataAbout.button.text, link: dataAbout.button.link } : null}
                    />
                </div>
                <div className="columns-2 gap-4">
                    <MotionImage images={dataAbout.images} />
                </div>
            </div>
        </section>
    )
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// quality
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export function Quality() {
    return (
        <section className="custom-section bg-food">
            <div className="custom-container flex flex-col gap-16">
                <div className="flex flex-col gap-8 text-center lg:text-start">
                    <MotionText title={dataQuality.title} text={dataQuality.text} multitext={true} />
                    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
                        <MotionBox box={dataQuality.box} />
                    </div>
                </div>
            </div>
        </section>
    )
}