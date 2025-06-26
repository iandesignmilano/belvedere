// components
import Title from "@/components/site/Title"
import { MenuListPage } from "@/components/site/Menu"

// action
import { getMenu } from "@/actions/menu"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default async function MenuPage() {

    const pizze = await getMenu()

    return (
        <>
            <Title name="Menu" />
            <MenuListPage data={pizze} />
        </>
    )
}