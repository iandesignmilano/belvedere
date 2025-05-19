// components
import Title from "@/components/site/Title"
import { MenuListPage } from "@/components/site/Menu"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function MenuPage() {
    return (
        <>
            <Title name="Menu" />
            <MenuListPage />
        </>
    )
}