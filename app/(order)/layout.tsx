// components
import MotionLoader from "@/components/custom/motion/MotionLoader"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Layout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <MotionLoader>
            {children}
        </MotionLoader>
    )
}
