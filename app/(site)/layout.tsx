// components
import MotionLoader from "@/components/custom/motion/MotionLoader"
import MotionNav from "@/components/custom/motion/MotionNav"
import Footer from "@/components/site/Footer"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Layout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <MotionLoader>
            <MotionNav />
            {children}
            <Footer />
        </MotionLoader>
    )
}
