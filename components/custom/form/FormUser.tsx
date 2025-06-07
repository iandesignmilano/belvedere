"use client"

import { useState, useEffect } from 'react'

// formik + yup
import { useFormik } from 'formik'
import * as yup from "yup"

// shad
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"

// components
import { ToastSuccess, ToastDanger } from "../Toast"

// icons
import { Loader2 } from "lucide-react"

// action
import { createUserAction, updateUserAction, getUserById } from '@/actions/users'

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface FormUserProps {
    children: React.ReactNode
    type: "create" | "update"
    id?: string
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// type
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const text = {
    create: {
        title: "Crea un nuovo utente",
        description: "Compila i campi sottostanti per aggiungere un nuovo utente alla piattaforma.",
        button: "Aggiungi utente"
    },
    update: {
        title: "Modifica utente",
        description: "Aggiorna le informazioni dell'utente selezionato.",
        button: "Salva modifiche"
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// form 
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const getSchema = (type: "create" | "update") => (
    yup.object({
        fullname: yup.string().required("Nome e Cognome sono obbligatori"),
        email: yup
            .string()
            .required("L'email è obbligatoria")
            .email("Inserisci un'email valida"),
        password: yup.string().when([], {
            is: () => type === "create",
            then: (schema) =>
                schema
                    .required("La password è obbligatoria")
                    .min(8, "La password deve contenere almeno 8 caratteri"),
            otherwise: (schema) => schema.notRequired(),
        }),
        superuser: yup.boolean().optional().default(false),
        privileges: yup.string().optional(),
    })
)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function FormUser({ children, type, id }: FormUserProps) {

    const schema = getSchema(type)

    const [open, setOpen] = useState(false)

    const [initial, setInitial] = useState({ fullname: "", email: "", password: "", superuser: false, privileges: "" })

    // --------------------------------------------------------------
    // data (update)
    // --------------------------------------------------------------

    useEffect(() => {
        async function getUser() {
            if (id) {
                const data = await getUserById(id)
                if (data) {
                    setInitial({
                        fullname: data.fullname,
                        email: data.email,
                        password: "",
                        superuser: data.superuser,
                        privileges: data.privileges
                    })
                }
                else ToastDanger()
            }
        }
        getUser()
    }, [id, open])

    // --------------------------------------------------------------
    // form
    // --------------------------------------------------------------

    const formik = useFormik({
        initialValues: initial,
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: (val) => onSubmitFunction(val)
    })

    const { values, errors, touched, handleChange, handleBlur, isSubmitting, isValid, dirty, handleSubmit, handleReset, setFieldValue } = formik

    // --------------------------------------------------------------
    // checked
    // --------------------------------------------------------------

    function handleCheck(checked: boolean, name: string) {
        let val = values.privileges.split(",").map((v) => v.trim()).filter((v) => v)
        if (checked && !val.includes(name)) val.push(name)
        else if (!checked) val = val.filter((el) => el !== name)
        setFieldValue("privileges", val.join(","))
    }

    // --------------------------------------------------------------
    // send
    // --------------------------------------------------------------

    async function onSubmitFunction(val: typeof initial) {
        try {
            const res = type == 'create' ? await createUserAction(val) : await updateUserAction(id as string, val)
            if (res.success) {
                setOpen(false)
                handleReset(initial)
                ToastSuccess(type == "create" ? "Utente creato con successo!" : "Utente aggiornato con successo!")
            }
            if (res.errors) ToastDanger()
        } catch { ToastDanger() }
    }

    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------

    return (
        <>
            <div onClick={() => setOpen(true)}>{children}</div>

            <Drawer open={open} onOpenChange={() => setOpen(false)}>
                <DrawerContent onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                    <DrawerHeader>
                        <DrawerTitle className="text-2xl text-primary">{text[type].title}</DrawerTitle>
                        <DrawerDescription className="text-base">{text[type].description}</DrawerDescription>
                    </DrawerHeader>
                    <Separator />
                    <section className="p-4 overflow-y-auto flex-1 grid lg:grid-cols-3 gap-4">

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

                        <div className="space-y-2">
                            <Label className="pl-3">Password</Label>
                            <Input
                                type='password'
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                                className={errors.password && touched.password ? "custom-form-error" : ""}
                            />
                            {errors.password && touched.password && <p className="text-destructive text-sm pl-3">{errors.password}</p>}
                        </div>

                        <Separator className='lg:col-span-3' />

                        <div className='lg:col-span-3 space-y-4'>
                            <Label>Superutente</Label>
                            <Switch
                                checked={values.superuser}
                                onCheckedChange={(checked) => {
                                    const check = checked ? "update,create,delete" : ""
                                    setFieldValue("superuser", checked)
                                    setFieldValue("privileges", check)
                                }}
                            />
                        </div>

                        <Separator className='lg:col-span-3' />

                        <div className='lg:col-span-3 space-y-4'>
                            <Label>Privilegi</Label>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    className='size-6 bg-input'
                                    checked={values.privileges.includes('update')}
                                    onCheckedChange={(checked: boolean) => handleCheck(checked, "update")}
                                />
                                <p className='text-base'>Modifica</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    className='size-6 bg-input'
                                    checked={values.privileges.includes('create')}
                                    onCheckedChange={(checked: boolean) => handleCheck(checked, "create")}
                                />
                                <p className='text-base'>Crea</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    className='size-6 bg-input'
                                    checked={values.privileges.includes('delete')}
                                    onCheckedChange={(checked: boolean) => handleCheck(checked, "delete")}
                                />
                                <p className='text-base'>Elimina</p>
                            </div>
                        </div>
                    </section>
                    <Separator />
                    <DrawerFooter className="flex items-center justify-end gap-4 flex-row">
                        <DrawerClose asChild>
                            <Button className="custom-button max-lg:grow" type='button' variant="destructive">Annulla</Button>
                        </DrawerClose>
                        <Button
                            type='submit'
                            className="custom-button max-lg:grow"
                            disabled={!isValid || !dirty || isSubmitting}
                            onClick={() => handleSubmit()}
                        >
                            {isSubmitting && <Loader2 className="animate-spin" />}
                            {text[type].button}
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}