// next
import Link from "next/link"

//icons
import { Mail, Navigation, Phone, Clock, CircleFadingPlus } from "lucide-react"

// data
import { contacts } from "@/assets/data/contacts"

// components
import MotionText from "../custom/motion/MotionText"
import { MotionIconBox } from "../custom/motion/MotionBox"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// data
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const data = [
    {
        icon: <Navigation className="size-4 lg:size-6" />,
        name: "Indirizzo",
        text: contacts.street
    },
    {
        icon: <Phone className="size-4 lg:size-6" />,
        name: "Telefono",
        link: {
            link: contacts.phone.link,
            text: contacts.phone.text
        }
    },
    {
        icon: <Mail className="size-4 lg:size-6" />,
        name: "Email",
        link: {
            link: contacts.email.link,
            text: contacts.email.text
        }
    },
    {
        icon: <CircleFadingPlus className="size-4 lg:size-6" />,
        name: "Instagram",
        link: {
            link: contacts.intagram.link,
            text: contacts.intagram.text,
            blank: true
        }
    },
    {
        icon: <Clock className="size-4 lg:size-6" />,
        name: "Orari",
        text: [contacts.clock.close, contacts.clock.day, contacts.clock.week]
    }
]

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Footer() {
    return (
        <section className="custom-section bg-food">
            <div className="custom-container">
                <MotionText title={contacts.title} />
                <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8 mt-8">
                    <div className="flex flex-col gap-8">
                        <MotionIconBox box={data} footer={true} />
                    </div>
                    <div>
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5585.255469650138!2d9.119503676657626!3d45.57792422584304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47869581ef54490b%3A0xe07d9a5c103bc9e2!2sPizzeria%20Belvedere!5e0!3m2!1sit!2sit!4v1746993120561!5m2!1sit!2sit" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="border-0 w-full h-96 rounded-xl shadow-2xl shadow-primary" />
                    </div>
                </div>

                <div className="mt-16 sm:mt-32 flex flex-col gap-2 items-center sm:items-start">
                    <p className="text-xs sm:text-sm">
                        @2025 Pizzeria Belvedere - Tutti i diritti riservati. | Dev:&nbsp;
                        <Link
                            href="https://iandesign.it"
                            className="hover:text-primary custom-transition"
                            target="_blank"
                        >
                            Ian Design
                        </Link>
                    </p>
                    <p className="text-xs sm:text-sm flex gap-2">
                        <Link
                            href="/gdpr/privacy-policy"
                            className="hover:text-primary custom-transition"
                            target="_blank"
                        >
                            Privacy
                        </Link> |
                        <Link
                            href="/gdpr/cookie-policy"
                            className="hover:text-primary custom-transition"
                            target="_blank"
                        >
                            Cookie
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}