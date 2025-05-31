// components
import Hero from "@/components/private/sidebar/Hero"
import ProfileForm from "@/components/custom/form/profile/ProfileForm"
import PasswordForm from "@/components/custom/form/profile/PasswordForm"

// action 
import { getProfileData } from "@/actions/profile"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default async function ProfilePage() {

    const profile = await getProfileData()

    return (
        <>
            <Hero path={[{ name: "Il tuo profilo" }]} />
            <section className="px-4 pb-4 w-full md:py-2 flex flex-col gap-4">
                {profile && <ProfileForm {...profile} />}
                <PasswordForm />
            </section>
        </>
    )
}