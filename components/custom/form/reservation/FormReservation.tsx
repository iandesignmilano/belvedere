"use client"

// formik + yup
import { useFormik } from 'formik'
import * as yup from "yup"

// components
import Step1 from "./Step1"
import Step2 from "./Step2"
import { ToastDanger } from '../../Toast'

// motion
import { motion } from "motion/react"

// actions and hook
import { addReservationAction, AddProps } from '@/actions/reservations'

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface FormReservationProps {
    progress: number;
    setProgress: React.Dispatch<React.SetStateAction<number>>;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// transitions
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const anim = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeInOut" }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// form 
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const stepSchemas = [

    // step 1
    yup.object({
        fullname: yup
            .string()
            .required("Nome e Cognome sono obbligatori"),

        email: yup
            .string()
            .required("L'email è obbligatoria")
            .email("Inserisci un'email valida"),

        phone: yup
            .string()
            .required("Il numero di telefono è obbligatorio")
            .matches(/^\+?[0-9\s\-]{7,15}$/, "Inserisci un numero di telefono valido")
    }),

    // step 2
    yup.object({
        people: yup
            .number()
            .required("Indica il numero di persone")
            .positive("Minimo 1 persona")
            .min(1, "Minimo 1 persona")
            .max(15, "Oltre 15 persone chiama il numero: 02 241 65 947"),

        date: yup
            .string()
            .required("La data è obbligatoria"),

        time: yup
            .string()
            .required("L'orario è obbligatorio"),
    })
]

const formInitialValue = {
    fullname: "",
    email: "",
    phone: "",
    people: 2,
    date: "",
    time: ""
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function FormReservation({ progress, setProgress }: FormReservationProps) {

    // --------------------------------------------------------------
    // form
    // --------------------------------------------------------------

    const formik = useFormik({
        initialValues: formInitialValue,
        validationSchema: stepSchemas[progress],
        onSubmit: (values) => onSubmitFunction(values)
    })

    // --------------------------------------------------------------
    // send
    // --------------------------------------------------------------

    async function onSubmitFunction(val: AddProps) {
        try {
            const res = await addReservationAction(val)
            if (res.success) setProgress(progress + 1)
            if (res.errors) ToastDanger()
        } catch { ToastDanger() }
    }

    // --------------------------------------------------------------
    // form
    // --------------------------------------------------------------

    const formStep = [
        <Step1 key="step-1" {...formik} progress={progress} setProgress={setProgress} />,
        <Step2 key="step-2" {...formik} progress={progress} setProgress={setProgress} />
    ]

    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------

    return (
        <motion.form
            key={progress}
            initial={anim.initial}
            transition={anim.transition}
            whileInView={anim.whileInView}
            className="grid lg:grid-cols-2 gap-8 text-start"
            onSubmit={formik.handleSubmit}
        >
            {formStep[progress]}
        </motion.form>
    )
}