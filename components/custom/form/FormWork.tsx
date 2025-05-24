"use client"

import { useRef } from "react"

// shad
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

// formik + yup
import { useFormik } from 'formik'
import * as yup from "yup"

// motion
import { motion } from "motion/react"

// components
import MotionText from "../motion/MotionText"
import { ToastSuccess, ToastDanger } from "../Toast"

// icons
import { Loader2 } from "lucide-react"

// action
import { sendMailWorkAction } from "@/actions/sendMail"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// data
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const text = [
    "Stiamo cercando persone sveglie, con voglia di imparare e far parte di una squadra affiatata! Lavoro serale e nei weekend: se ti piace stare in mezzo alla gente, potresti essere la persona giusta.",
    "Compila il form qui sotto oppure manda il tuo CV a: infopizzeriabelvedere@gmail.com"
]

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// transitions
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const anim = {
    initial: { opacity: 0 },
    whileInView: {
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeInOut"
        }
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// form 
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const schema = yup.object({
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
        .matches(/^\+?[0-9\s\-]{7,15}$/, "Inserisci un numero di telefono valido"),

    file: yup
        .mixed()
        .required("Il file è obbligatorio")
        .test("fileType", "Deve essere un file PDF", value => { return value instanceof File && value.type === "application/pdf" })
        .test("fileSize", "Il file deve essere massimo 2MB", value => { return value instanceof File && value.size <= 2 * 1024 * 1024 }),

    message: yup
        .string()
        .optional(),

    privacy: yup
        .boolean()
        .oneOf([true], "Devi accettare la privacy")
})

const initial = {
    fullname: "",
    email: "",
    phone: "",
    file: null,
    privacy: false,
    message: ""
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function FormWork() {

    const fileInputRef = useRef<HTMLInputElement>(null)

    // --------------------------------------------------------------
    // form
    // --------------------------------------------------------------

    const formik = useFormik({
        initialValues: initial,
        validationSchema: schema,
        onSubmit: (val) => onSubmitFunction(val)
    })

    const { values, errors, touched, handleChange, handleBlur, isSubmitting, isValid, dirty, setFieldValue, setFieldTouched, handleSubmit, handleReset } = formik

    // --------------------------------------------------------------
    // send
    // --------------------------------------------------------------

    async function onSubmitFunction(val: typeof initial) {
        try {
            const res = await sendMailWorkAction(val)
            if (res.success) {
                handleReset(initial)
                if (fileInputRef.current) fileInputRef.current.value = ""
                ToastSuccess("Candidatura inviata con successo!")
            }
        } catch { ToastDanger("Errore durante l'invio. Riprova più tardi.") }
    }

    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------

    return (
        <section className="custom-section bg-food">
            <div className="custom-container flex flex-col gap-8">
                <MotionText text={text} />
                <motion.form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-2 gap-8 mt-8"
                    initial={anim.initial}
                    whileInView={anim.whileInView}
                >
                    <div className="space-y-2 col-span-2">
                        <Label className="text-base pl-3">Nome e Cognome</Label>
                        <Input
                            name="fullname"
                            placeholder="Nome e Cognome"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.fullname}
                            className={errors.fullname && touched.fullname ? "custom-form-error" : ""}
                        />
                        {errors.fullname && touched.fullname && <p className="text-destructive text-sm pl-3">{errors.fullname}</p>}
                    </div>
                    <div className="space-y-2 max-lg:col-span-2">
                        <Label className="text-base pl-3">Email</Label>
                        <Input
                            name="email"
                            placeholder="Email"
                            type="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                            className={errors.email && touched.email ? "custom-form-error" : ""}
                        />
                        {errors.email && touched.email && <p className="text-red-500 text-sm pl-3">{errors.email}</p>}
                    </div>
                    <div className="space-y-2 max-lg:col-span-2">
                        <Label className="text-base pl-3">Telefono</Label>
                        <Input
                            name="phone"
                            placeholder="Telefono"
                            type="tel"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.phone}
                            className={errors.phone && touched.phone ? "custom-form-error" : ""}
                        />
                        {errors.phone && touched.phone && <p className="text-red-500 text-sm pl-3">{errors.phone}</p>}
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label className="text-base pl-3">Curriculum (Max 2mb)</Label>
                        <Input
                            ref={fileInputRef}
                            name="file"
                            type="file"
                            onChange={(e) => {
                                setFieldTouched("file", true, true)
                                setFieldValue("file", e.currentTarget.files?.[0] || null)
                            }}
                            className={errors.file && touched.file ? "custom-form-error" : ""}
                        />
                        {errors.file && touched.file && <p className="text-red-500 text-sm pl-3">{errors.file}</p>}
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label className="text-base pl-3">Messaggio</Label>
                        <Textarea
                            name="message"
                            placeholder="Messaggio"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.message}
                        />
                    </div>
                    <div className="col-span-2 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                className="size-6 bg-input"
                                checked={values.privacy}
                                onCheckedChange={(checked) => {
                                    setFieldTouched("privacy", true, true)
                                    setFieldValue("privacy", checked)
                                }}
                            />
                            <Label className="text-base">Acconsento al trattamento dei miei dati personali secondo l&lsquo;informativa di questo sito.</Label>
                        </div>
                        {errors.privacy && touched.privacy && <p className="text-destructive text-xs">{errors.privacy}</p>}
                    </div>
                    <div className="col-span-2 text-right">
                        <Button
                            type="submit"
                            className="custom-button !text-lg max-lg:w-full"
                            disabled={!isValid || !dirty || isSubmitting}
                        >
                            {isSubmitting && <Loader2 className="animate-spin" />}
                            Invia CV
                        </Button>
                    </div>
                </motion.form>
            </div>
        </section>
    )
}