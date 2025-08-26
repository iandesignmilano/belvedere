// data
import { buttonsList } from "./Banner"

// components
import MotionText from "../custom/motion/MotionText"
import MotionImage from "../custom/motion/MotionImage"
import MotionMenu from "../custom/motion/MotionMenu"
import MotionButton from "../custom/motion/MotionButton"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface MenuProps {
    data: {
        name: string
        ingredients: {
            name: string
        }[]
        total_base: string
        total_xl: string
    }[]
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// data
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const dataMenu = {
    title: "Scelte di gusto",
    text: ["Dai grandi classici alle specialità della casa, ogni trancio è preparato con ingredienti selezionati e tanta passione."],
    images: [
        { path: "/pages/home-pizza-1.jpg", alt: "" },
        { path: "/pages/home-pizza-2.jpg", alt: "" },
        { path: "/pages/home-pizza-3.jpg", alt: "" }
    ],
    button: {
        text: "Guarda tutto il menù",
        link: "/menu",
        className: "block w-full mt-8"
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// menu home page
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export function Menu({ data }: MenuProps) {
    return (
        <section className="custom-section bg-food">
            <div className="custom-container flex flex-col-reverse xl:grid xl:grid-cols-3 gap-16">
                <div className="flex flex-col gap-8 xl:col-span-2">
                    <MotionText title={dataMenu.title} text={dataMenu.text} />
                    <MotionMenu menu={data} />
                    <MotionText button={dataMenu.button} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <MotionImage images={dataMenu.images} menu />
                </div>
            </div>
        </section>
    )
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// menu page
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export function MenuListPage({ data }: MenuProps) {
    return (
        <section className="custom-section bg-food">
            <div className="custom-container flex flex-col gap-8">
                <span className="mt-8">
                    <MotionText title="Pizze" />
                </span>
                <div className="flex flex-col gap-8">
                    <MotionMenu menu={data} />
                </div>
                <div className="flex max-lg:flex-col gap-8 lg:gap-4 mt-8 lg:mt-16 lg:justify-end">
                    <MotionButton buttons={buttonsList} show className="py-4 shadow-2xl shadow-primary" />
                </div>
            </div>
        </section>
    )
}