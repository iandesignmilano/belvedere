"use client"

// next
import { useRouter } from 'next/navigation'

// formik + yup
import { useFormik } from 'formik'
import * as yup from "yup"

// action
import { addOrderAction, OrderBase } from '@/actions/orders'

// shad
import { Button } from '@/components/ui/button'

// icon
import { Loader2 } from 'lucide-react'

// components
import { ToastDanger, ToastSuccess } from '@/components/custom/Toast'
import Step1 from '@/components/custom/form/order/Step1'
import Step2 from '@/components/custom/form/order/Step2'
import Step3 from '@/components/custom/form/order/Step3'
import Step4 from '@/components/custom/form/order/Step4'

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// schema
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const schema = yup.object({
    order: yup
        .array()
        .of(
            yup.object({
                id: yup.number().integer().positive(),

                name: yup.string().optional(),

                type_list: yup.string().optional(),

                ingredients: yup
                    .array()
                    .of(
                        yup.object({
                            name: yup.string().optional(),
                            price: yup.string().optional(),
                            xl: yup.string().optional(),
                            xxl: yup.string().optional()
                        })
                    )
                    .optional(),

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
        .min(1, "L'ordine deve contenere almeno un elemento"),

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
    }),

    date: yup
        .string()
        .required("La data è obbligatoria"),

    time: yup
        .string()
        .required("L'orario è obbligatorio"),

    fullname: yup
        .string()
        .required("Nome e Cognome sono obbligatori"),

    email: yup
        .string()
        .optional()
        .email("Inserisci un'email valida"),

    phone: yup
        .string()
        .required("Il numero di telefono è obbligatorio")
        .matches(/^\+?[0-9\s\-]{7,15}$/, "Inserisci un numero di telefono valido")
})

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// values
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const formInitialValue = {
    order: [],

    type: "",
    address: {
        street: "",
        street_number: "",
        city: "",
        cap: "",
        zone: ""
    },

    date: "",
    time: "",

    fullname: "",
    email: "",
    phone: "",

    site: "sede",
    pay: "home",
    pay_id: ""
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function OrderAdd({ user }: { user?: string }) {

    // router
    const router = useRouter()

    // --------------------------------------------------------------
    // form
    // --------------------------------------------------------------

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: formInitialValue,
        validationSchema: schema,
        onSubmit: (values) => onSubmitFunction(values, user)
    })

    // --------------------------------------------------------------
    // send
    // --------------------------------------------------------------

    async function onSubmitFunction(val: OrderBase, user?: string) {
        try {
            const res = await addOrderAction(val, user)
            if (res.success) {
                router.push("/private/ordini")
                ToastSuccess("Ordine aggiunto con successo!")
            }
            if (res.errors) ToastDanger()
        } catch { ToastDanger() }
    }

    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------

    return (
        <form className='grid lg:grid-cols-2 gap-8 text-start' onSubmit={formik.handleSubmit}>
            <div className='lg:col-span-2'>
                <div className='text-base bg-primary rounded-md text-white p-2'>
                    Ordine
                </div>
            </div>
            <Step1 {...formik} />

            <div className='lg:col-span-2'>
                <div className='text-base bg-primary rounded-md text-white p-2'>
                    Consegna
                </div>
            </div>
            <Step2 {...formik} />

            <div className='lg:col-span-2'>
                <div className='text-base bg-primary rounded-md text-white p-2'>
                    Data e ora
                </div>
            </div>
            <Step3 {...formik} />

            <div className='lg:col-span-2'>
                <div className='text-base bg-primary rounded-md text-white p-2'>
                    Informazioni
                </div>
            </div>
            <Step4 {...formik} />

            <div className="lg:col-span-2 flex max-lg:flex-col-reverse gap-4 justify-between">
                <Button
                    onClick={() => router.back()}
                    className="custom-button !text-lg max-lg:w-full"
                    variant="destructive"
                    type="button"
                >
                    Annulla
                </Button>
                <Button
                    type="submit"
                    className="custom-button !text-lg max-lg:w-full"
                    disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
                >
                    {formik.isSubmitting && <Loader2 className="size-6 animate-spin" />}
                    Aggiungi ordine
                </Button>
            </div>
        </ form>
    )
}