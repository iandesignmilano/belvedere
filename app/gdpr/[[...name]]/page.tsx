// component
import CookiePage from "@/components/custom/gdpr/CookiePage"
import PrivacyPage from "@/components/custom/gdpr/PrivacyPage"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

type ParamsProps = Promise<{ name: string[] }>

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// data
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const data = {
    info: "Pizzeria Belvedere Senago",
    email: "pizzeriabelvedere@libero.it"
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default async function Gdpr({ params }: { params: ParamsProps }) {
    const { name } = await params

    if (name[0].includes("privacy")) {
        return <PrivacyPage info={data.info} email={data.email} />
    }

    return <CookiePage info={data.info} email={data.email} />
}