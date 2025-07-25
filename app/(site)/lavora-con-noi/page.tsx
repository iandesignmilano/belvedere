// components
import Title from "@/components/site/Title"
import FormWork from "@/components/custom/form/FormWork"

// shad
import { Toaster } from "@/components/ui/sonner"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function WorkPage() {
    return (
        <>
            <Title name="Lavora con noi" />
            <FormWork />
            <Toaster />
        </>
    )
}