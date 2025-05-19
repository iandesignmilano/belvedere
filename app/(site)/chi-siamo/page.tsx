// components
import Title from "@/components/site/Title"
import { About } from "@/components/site/About"
import { Quality } from "@/components/site/About"
import Banner from "@/components/site/Banner"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function AboutPage() {
    return (
        <>
            <Title name="Chi siamo" />
            <About page={true} />
            <Quality />
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