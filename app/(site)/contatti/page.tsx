// components
import Title from "@/components/site/Title"
import Contact from "@/components/site/Contact"
import Banner from "@/components/site/Banner"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function ContactPage() {
    return (
        <>
            <Title name="Contatti" />
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5585.255469650138!2d9.119503676657626!3d45.57792422584304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47869581ef54490b%3A0xe07d9a5c103bc9e2!2sPizzeria%20Belvedere!5e0!3m2!1sit!2sit!4v1746993120561!5m2!1sit!2sit" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="border-0 w-full h-[600px]" />
            <Contact />
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