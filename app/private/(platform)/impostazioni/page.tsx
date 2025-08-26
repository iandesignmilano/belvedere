// components
import Hero from "@/components/private/sidebar/Hero"
import SettingsBox from "@/components/private/settings/SettingsBox"

// action
import { getProfilePrivileges } from "@/actions/profile"
import { getSettings } from "@/actions/settings"


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default async function SettingsPage() {

    const user = await getProfilePrivileges()
    const privileges = (user?.superuser ? "all" : user?.privileges) as string

    const settings = await getSettings()

    return (
        <>
            <Hero path={[{ name: "Impostazioni" }]} />
            <section className="px-4 pb-4 w-full md:py-2 flex flex-col gap-4">
                <SettingsBox privileges={privileges} settingsData={settings} />
            </section>
        </>
    )
}