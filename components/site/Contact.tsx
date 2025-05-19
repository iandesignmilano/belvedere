//icons
import { Mail, Navigation, Phone } from "lucide-react"

// data
import { contacts } from "@/assets/data/contacts"

// components
import { MotionIconBox } from "../custom/motion/MotionBox"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// data
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const data = [
    {
        icon: <Navigation className="size-8" />,
        name: "Indirizzo",
        text: contacts.street
    },
    {
        icon: <Phone className="size-8" />,
        name: "Telefono",
        link: {
            link: contacts.phone.link,
            text: contacts.phone.text
        }
    },
    {
        icon: <Mail className="size-8" />,
        name: "email",
        link: {
            link: contacts.email.link,
            text: contacts.email.text
        }
    }
]

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Contact() {
    return (
        <section className="custom-section bg-food">
            <div className="custom-container grid lg:grid-cols-3 items-center gap-16 lg:gap-8">
                <MotionIconBox box={data} />
            </div>
        </section>
    )
}