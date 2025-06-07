// components
import Hero from "@/components/private/sidebar/Hero"
import IngredientsList from "@/components/private/ingredients/IngredientsList"

// action
import { getProfilePrivileges } from "@/actions/profile"
import { getIngredients } from "@/actions/ingredients"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default async function IngredientsPage() {

    const user = await getProfilePrivileges()
    const privileges = (user?.superuser ? "all" : user?.privileges) as string

    const ingredients = await getIngredients()

    if (!ingredients) { return <>Caricamento....</> }

    return (
        <>
            <Hero path={[{ name: "Ingredienti" }]} />
            <section className="px-4 pb-4 w-full md:py-2 flex flex-col gap-4">
                <IngredientsList ingredients={ingredients} privileges={privileges} />
            </section>
        </>
    )
}