// next
import { cookies } from "next/headers"

// components
import MotionLoader from "@/components/custom/motion/MotionLoader"
import MotionNav from "@/components/custom/motion/MotionNav"
import Footer from "@/components/site/Footer"
import CookieBanner from "@/components/custom/gdpr/CookieBanner"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default async function Layout({ children }: Readonly<{ children: React.ReactNode; }>) {

    const cookie = await cookies()
    const pref = cookie.get('cookie_preferences')?.value
    const showBanner = !pref

    return (
        <MotionLoader>
            <MotionNav />
            {children}
            <Footer />
            <CookieBanner show={showBanner} />
        </MotionLoader>
    )
}
