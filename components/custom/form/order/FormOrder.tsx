"use client"

import { useState, useEffect } from 'react'

// formik + yup
import { useFormik } from 'formik'
import * as yup from "yup"

// motion
import { motion } from "motion/react"

// components
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'
import { ToastDanger } from '../../Toast'

// action
import { addOrderAction, OrderBase } from '@/actions/orders'
import { SumupCheckoutStatus } from '@/actions/sumup'

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface FormOrderProps {
    progress: number;
    setProgress: React.Dispatch<React.SetStateAction<number>>;
}

interface onSubmitProps extends FormOrderProps {
    val: OrderBase
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
// schema 
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const stepSchemas = [

    // step 1
    yup.object({
        order: yup
            .array()
            .of(
                yup.object({
                    id: yup.number().integer().positive(),

                    name: yup.string().optional(),

                    type_list: yup.string().optional(),

                    ingredients: yup.string().optional(),

                    type: yup
                        .string()
                        .oneOf(["base", "xl", "xxl"], "Porzione non valida")
                        .required("Porzione obbligatoria"),

                    price: yup.string().optional(),

                    quantity: yup
                        .number()
                        .integer()
                        .transform((value, originalValue) =>
                            String(originalValue).trim() === "" ? undefined : value
                        )
                        .typeError("Deve essere almeno 1")
                        .min(1, "Deve essere almeno 1")
                        .required("Deve essere almeno 1"),

                    custom: yup
                        .array()
                        .of(
                            yup.object({
                                name: yup.string().optional(),
                                price: yup.string().optional(),
                                xl: yup.string().optional()
                            })
                        )
                        .nullable(),

                    total: yup.string().optional(),
                })
            )
            .min(1, "L'ordine deve contenere almeno un elemento")
    }),

    // step 2
    yup.object({
        type: yup
            .string()
            .oneOf(["take_away", "domicile"], "Tipo ordine non valido")
            .required("Il tipo di ordine è obbligatorio"),

        address: yup.object({
            street: yup
                .string()
                .when("$type", {
                    is: "domicile",
                    then: (schema) => schema.required("L'indirizzo è obbligatorio"),
                    otherwise: (schema) => schema.notRequired(),
                }),

            street_number: yup
                .string()
                .when("$type", {
                    is: "domicile",
                    then: (schema) => schema.required("Il numero civico è obbligatorio"),
                    otherwise: (schema) => schema.notRequired(),
                }),

            city: yup
                .string()
                .when("$type", {
                    is: "domicile",
                    then: (schema) => schema.required("La città è obbligatoria"),
                    otherwise: (schema) => schema.notRequired(),
                }),

            cap: yup
                .string()
                .matches(/^\d{5}$/, "Il CAP deve essere di 5 cifre")
                .when("$type", {
                    is: "domicile",
                    then: (schema) => schema.required("Il CAP è obbligatorio"),
                    otherwise: (schema) => schema.notRequired(),
                }),

            zone: yup
                .string()
                .optional()
        })

    }),

    // step 3
    yup.object({
        date: yup.string().required("La data è obbligatoria"),

        time: yup.string().required("L'orario è obbligatorio"),
    }),

    // step 4
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
    })
]

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// values 
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const formInitialValue = {
    // step 1
    order: [],

    // step 2
    type: "",
    address: {
        street: "",
        street_number: "",
        city: "",
        cap: "",
        zone: ""
    },

    // step 3
    date: "",
    time: "",

    // step 4
    fullname: "",
    email: "",
    phone: "",

    pay: "",
    pay_id: ""
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// send
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

async function onSubmitFunction({ val, progress, setProgress }: onSubmitProps) {
    try {
        const res = await addOrderAction(val)
        if (res.success) setProgress(progress + 1)
        if (res.errors) ToastDanger()
    } catch { ToastDanger() }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function FormOrder({ progress, setProgress }: FormOrderProps) {

    // --------------------------------------------------------------
    // values
    // --------------------------------------------------------------

    const [initialValues, setInitialValues] = useState<OrderBase>(formInitialValue)

    useEffect(() => {

        async function checkoutInfo() {

            const code = localStorage.getItem('transition_code')
            const order = localStorage.getItem('order')

            if (code && order) {
                const parsed = JSON.parse(order)
                const status = await SumupCheckoutStatus(code)

                // #TODO
                if (status == "SUCCESS") {
                    const values = { ...parsed, pay: "card", pay_id: code }
                    await onSubmitFunction({ val: values, progress: 4, setProgress })
                }

                if (status == "PENDING" || status == "FAILED") {
                    setInitialValues(parsed)
                    localStorage.removeItem('order')
                    localStorage.removeItem('transition_code')
                    setProgress(4)
                }
            }
        }

        checkoutInfo()

    }, [setProgress])

    // --------------------------------------------------------------
    // form
    // --------------------------------------------------------------

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema: stepSchemas[progress],
        onSubmit: (values) => onSubmitFunction({ val: values, progress, setProgress })
    })

    // --------------------------------------------------------------
    // form
    // --------------------------------------------------------------

    const formStep = [
        <Step1 key="step-1" {...formik} progress={progress} setProgress={setProgress} />,
        <Step2 key="step-2" {...formik} progress={progress} setProgress={setProgress} />,
        <Step3 key="step-3" {...formik} progress={progress} setProgress={setProgress} />,
        <Step4 key="step-4" {...formik} progress={progress} setProgress={setProgress} />,
        <Step5 key="step-5" {...formik} progress={progress} setProgress={setProgress} />
    ]

    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------

    return (
        <motion.form
            key={progress}
            initial={anim.initial}
            whileInView={anim.whileInView}
            transition={anim.transition}
            className="grid lg:grid-cols-2 gap-8 text-start"
        >
            {formStep[progress]}
        </motion.form>
    )
}