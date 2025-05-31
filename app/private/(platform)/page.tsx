// components
import Hero from "@/components/private/sidebar/Hero"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Dashboard() {
    return (
        <>
            <Hero path={[{ name: "Dashboard" }]} />
        </>
    )
}