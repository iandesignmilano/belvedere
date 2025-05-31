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
import { updateProfilePasswordAction } from '@/actions/profile'

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// form 
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const schema = yup.object({
    old_password: yup.string().required("La password attuale è obbligatoria").min(8, "La password deve contenere almeno 8 caratteri"),
    new_password: yup.string().required("La nuova password è obbligatoria").min(8, "La password deve contenere almeno 8 caratteri"),

    repeat_new_password: yup
        .string()
        .required("Conferma la nuova password")
        .oneOf([yup.ref("new_password")], "Le password non coincidono")
})

const initial = { old_password: "", new_password: "", repeat_new_password: "" }

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function PasswordForm() {

    // --------------------------------------------------------------
    // form
    // --------------------------------------------------------------

    const formik = useFormik({
        initialValues: initial,
        validationSchema: schema,
        onSubmit: (val) => onSubmitFunction(val)
    })

    const { values, errors, touched, handleChange, handleBlur, isSubmitting, isValid, dirty, handleSubmit, handleReset } = formik

    // --------------------------------------------------------------
    // send
    // --------------------------------------------------------------

    async function onSubmitFunction(val: typeof initial) {
        try {
            const res = await updateProfilePasswordAction(val)
            if (res.success) {
                ToastSuccess("Profilo aggiornato con successo!")
                handleReset(initial)
            }
        } catch { ToastDanger() }
    }

    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------


    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Modifica la tua password</CardTitle>
                    <CardDescription>Inserisci la password attuale e scegline una nuova</CardDescription>
                </CardHeader>
                <CardContent className='grid lg:grid-cols-3 gap-4'>
                    <div className="space-y-2">
                        <Label className="pl-3">Password attuale</Label>
                        <Input
                            type='password'
                            name="old_password"
                            placeholder="Password attuale"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.old_password}
                            className={errors.old_password && touched.old_password ? "custom-form-error" : ""}
                        />
                        {errors.old_password && touched.old_password && <p className="text-destructive text-sm pl-3">{errors.old_password}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="pl-3">Nuova password</Label>
                        <Input
                            type='password'
                            name="new_password"
                            placeholder="Nuova password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.new_password}
                            className={errors.new_password && touched.new_password ? "custom-form-error" : ""}
                        />
                        {errors.new_password && touched.new_password && <p className="text-destructive text-sm pl-3">{errors.new_password}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="pl-3">Ripeti password</Label>
                        <Input
                            type='password'
                            name="repeat_new_password"
                            placeholder="Password attuale"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.repeat_new_password}
                            className={errors.repeat_new_password && touched.repeat_new_password ? "custom-form-error" : ""}
                        />
                        {errors.repeat_new_password && touched.repeat_new_password && <p className="text-destructive text-sm pl-3">{errors.repeat_new_password}</p>}
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
                        Aggiorna password
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}