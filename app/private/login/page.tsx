"use client"

import { useState } from "react"

// next
import Link from "next/link"

// shad
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// formik + yup
import { useFormik } from 'formik'
import * as yup from "yup"

// motion
import { motion } from "motion/react"

// icons
import { Loader2, Eye, EyeClosed } from "lucide-react"

// components
import { ToastDanger } from "@/components/custom/Toast"

// action
import { loginAction } from "@/actions/auth"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// transitions
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const anim = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeInOut" }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// form 
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const schema = yup.object({
    email: yup.string().required("L'email è obbligatoria").email("Inserisci un'email valida"),
    password: yup.string().required("La password è obbligatoria").min(8, "La password deve contenere almeno 8 caratteri")
})

const initial = { email: "", password: "" }

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Login() {

    // password
    const [showPassowrd, setShowPassoword] = useState(false)

    // --------------------------------------------------------------
    // form
    // --------------------------------------------------------------

    const formik = useFormik({
        initialValues: initial,
        validationSchema: schema,
        onSubmit: (val) => onSubmitFunction(val)
    })

    const { values, errors, touched, handleChange, handleBlur, isSubmitting, isValid, dirty, handleSubmit } = formik

    // --------------------------------------------------------------
    // send
    // --------------------------------------------------------------

    async function onSubmitFunction(val: typeof initial) {
        const res = await loginAction(val)
        if (res.errors) ToastDanger()
    }

    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------


    return (
        <section className="relative py-10 lg:py-20 overflow-hidden bg-food min-h-svh flex flex-col items-center justify-center">
            <div className="custom-container md:flex items-center justify-center">
                <motion.form
                    onSubmit={handleSubmit}
                    initial={anim.initial}
                    animate={anim.animate}
                    transition={anim.transition}
                    className="md:w-96 lg:w-4/12"
                >
                    <Card className="py-12 lg:py-20">
                        <CardHeader className="text-center">
                            <CardTitle className="font-title text-primary text-6xl">Accedi</CardTitle>
                            <CardDescription>Inserisci le tue credenziali per accedere</CardDescription>
                        </CardHeader>
                        <CardContent className="gap-6 flex flex-col">
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
                                <div className="flex items-center justify-between">
                                    <Label className="text-base pl-3">Password</Label>
                                    <span onClick={() => setShowPassoword(!showPassowrd)} className="cursor-pointer text-muted-foreground hover:text-primary *:size-4">
                                        {showPassowrd ? <EyeClosed /> : <Eye />}
                                    </span>
                                </div>
                                <Input
                                    name="password"
                                    placeholder="Password"
                                    type={showPassowrd ? "text" : "password"}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    className={errors.password && touched.password ? "custom-form-error" : ""}
                                />
                                {errors.password && touched.password && <p className="text-red-500 text-sm pl-3">{errors.password}</p>}
                            </div>
                        </CardContent>
                        <CardFooter className="gap-6 flex-col">
                            <Button className="custom-button w-full !text-lg" type="submit" disabled={!isValid || !dirty || isSubmitting}>
                                {isSubmitting && <Loader2 className="animate-spin" />}
                                Accedi
                            </Button>
                            <Link className="hover:text-primary custom-transition text-muted-foreground" href="/">Torna alla home</Link>
                        </CardFooter>
                    </Card>
                </motion.form>

            </div>
        </section>
    )
}