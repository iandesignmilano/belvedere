// components
import Intro from "@/components/site/Intro"
import { About, Quality } from "@/components/site/About"
import Banner from "@/components/site/Banner"
import { Menu } from "@/components/site/Menu"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function HomePage() {
    return (
        <>
            <Intro />
            <About />
            <Quality />
            <Banner
                title="Il trancio ti aspetta"
                text={[
                    "Che sia da portare a casa o da vivere qui da noi, il nostro trancio è sempre una certezza.",
                    "Ordina subito o prenota il tuo tavolo e goditi tutto il sapore del Belvedere."
                ]}
                bg="bg-pizza"
            />
            <Menu />
            <Banner
                title="A casa o da noi?"
                text={[
                    "Ovunque tu sia, il gusto del nostro trancio non cambia.",
                    "Prenota un tavolo per godertelo qui o ordinalo a casa: la bontà del Belvedere ti aspetta."
                ]}
                bg="bg-ingredients"
            />
        </>
    )
}
