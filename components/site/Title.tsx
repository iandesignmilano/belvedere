// components
import MotionText from "../custom/motion/MotionText"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface TitleProps {
    name: string;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Title({ name }: TitleProps) {
    return (
        <section className="py-36 lg:py-56 relative bg-pizza-title">
            <div className="custom-container text-center">
                <MotionText key={name} title={name} />
            </div>
        </section>
    )
}