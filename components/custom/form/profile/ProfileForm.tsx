"use client"

// formik + yup
import { useFormik } from 'formik'
import * as yup from "yup"

// shad
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// components
import { ToastSuccess, ToastDanger } from "../../Toast"

// icons
import { Loader2 } from "lucide-react"

// action
import { updateProfileDataAction } from '@/actions/profile'

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface ProfileFormProps {
    fullname: string
    email: string
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// form 
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const schema = yup.object({
    fullname: yup.string().required("Nome e Cognome sono obbligatori"),
    email: yup.string().required("L'email è obbligatoria").email("Inserisci un'email valida")
})

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function ProfileForm({ fullname, email }: ProfileFormProps) {

    // --------------------------------------------------------------
    // init
    // --------------------------------------------------------------

    const initial = { fullname, email }

    // --------------------------------------------------------------
    // form
    // --------------------------------------------------------------

    const formik = useFormik({
        initialValues: initial,
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: (val) => onSubmitFunction(val)
    })

    const { values, errors, touched, handleChange, handleBlur, isSubmitting, isValid, dirty, handleSubmit, handleReset } = formik

    // --------------------------------------------------------------
    // send
    // --------------------------------------------------------------

    async function onSubmitFunction(val: typeof initial) {
        try {
            const res = await updateProfileDataAction(val)
            if (res.success) ToastSuccess("Profilo aggiornato con successo!")
        } catch { ToastDanger() }
    }

    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Modifica il tuo profilo</CardTitle>
                    <CardDescription>Aggiorna le informazioni del tuo account</CardDescription>
                </CardHeader>
                <CardContent className='grid lg:grid-cols-2 gap-4'>
                    <div className="space-y-2">
                        <Label className="pl-3">Nome e Cognome</Label>
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

                    <div className="space-y-2">
                        <Label className="pl-3">Email</Label>
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
                </CardContent>
                <CardFooter className='justify-end gap-4'>
                    {dirty && (
                        <Button
                            type='button'
                            variant="destructive"
                            className="custom-button max-lg:w-full"
                            onClick={() => handleReset(initial)}
                            disabled={isSubmitting}
                        >
                            Annulla
                        </Button>
                    )}
                    <Button
                        type='submit'
                        className="custom-button max-lg:w-full"
                        disabled={!isValid || !dirty || isSubmitting}
                    >
                        {isSubmitting && <Loader2 className="animate-spin" />}
                        Aggiorna profilo
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}