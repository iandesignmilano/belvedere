import React from "react"

// next
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

// shad
import { Button } from "../ui/button"

// icon
import { Pizza, Calendar } from "lucide-react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// nav
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export const nav = [
    {
        title: "Chi siamo",
        link: '/chi-siamo',
    },
    {
        title: "Menù",
        link: "/menu"
    },
    {
        title: "Lavora con noi",
        link: "/lavora-con-noi"
    },
    {
        title: "Contatti",
        link: '/contatti'
    },
    {
        title: "Prenota",
        link: '/prenota',
        button: true,
        icon: <Calendar />,
        variant: "outline"
    },
    {
        title: "Ordina",
        link: '/ordina',
        button: true,
        icon: <Pizza />,
        variant: "default"
    }
]

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export type VariantProps = "outline" | "default" | "link" | "destructive" | "secondary" | "ghost"

interface NavbarProps {
    className: string;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export function Navbar({ className, open, setOpen }: NavbarProps) {

    // name
    const pathname = usePathname()

    return (
        <section className={`${className} custom-container px-8 grid grid-cols-2 lg:grid-cols-3 items-center gap-4 py-2 rounded-full custom-transition`}>
            <div>
                <Link href="/" className="flex items-center cursor-pointer" onClick={() => setOpen(false)}>
                    <Image src="/logo.webp" alt="" width={135} height={135} className="w-[80] lg:w-[100px]" />
                </Link>
            </div>

            {/**************************************************************************
             * desktop
            **************************************************************************/}

            <div className="flex items-center gap-8 text-lg max-lg:hidden">
                {nav
                    .filter(el => !el.button)
                    .map((el, index) => (
                        <Link
                            href={el.link}
                            key={index}
                            className={`hover:text-primary custom-transition ${pathname == el.link && '!text-primary font-bold'}`}
                            title={`Link alla pagina ${el.title}`}
                            aria-label={`Naviga alla pagina ${el.title}`}
                        >
                            {el.title}
                        </Link>
                    )
                    )}
            </div>

            <div className="flex items-center justify-end gap-8 max-lg:hidden">
                {nav
                    .filter(el => el.button)
                    .map((el, index) => (
                        <Link
                            href={el.link}
                            key={index}
                            title={`Link alla pagina ${el.title}`}
                            aria-label={`Naviga alla pagina ${el.title}`}
                        >
                            <Button
                                variant={el.variant as VariantProps}
                                className={`
                                    custom-button !text-lg 
                                    ${el.variant == "outline" && "custom-button-outline"}
                                `}
                            >
                                {el.icon} {el.title}
                            </Button>
                        </Link>
                    )
                    )}
            </div>

            {/**************************************************************************
             * mobile
            **************************************************************************/}

            <div className="flex justify-end items-center lg:hidden">
                <div className="w-12 h-12 relative overflow-hidden flex items-center justify-center" onClick={() => setOpen(!open)}>
                    <span className={`custom-mobile-burger  delay-75 ${open ? "w-10 rotate-45 bg-white" : "w-7 -translate-y-4 bg-black"}`} />
                    <span className={`custom-mobile-burger w-10 ${open ? "translate-x-14 bg-white" : "translate-x-0 bg-black"}`} />
                    <span className={`custom-mobile-burger delay-100 ${open ? "w-10 -rotate-45 bg-white" : "w-3.5 translate-y-4 bg-black"}`} />
                </div>
            </div>

        </section>
    )
}