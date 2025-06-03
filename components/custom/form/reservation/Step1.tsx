// next
import Link from "next/link"

// formik
import { FormikErrors, FormikTouched } from "formik"

// shad
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

type initialValue = {
    fullname: string;
    email: string;
    phone: string;
}

interface Step1Props {
    values: initialValue;
    errors: FormikErrors<initialValue>;
    touched: FormikTouched<initialValue>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;

    setProgress: React.Dispatch<React.SetStateAction<number>>;
    progress: number;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Step1({ values, errors, touched, handleBlur, handleChange, progress, setProgress }: Step1Props) {
    return (
        <>
            <div className="space-y-2 lg:col-span-2">
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

            <div className="space-y-2">
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

            <div className="space-y-2">
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

            <div className="lg:col-span-2 flex gap-4 justify-between">
                <Link href="/">
                    <Button className="custom-button !text-lg" variant="destructive" type="button">Annulla</Button>
                </Link>
                <Button
                    type="button"
                    className="custom-button !text-lg max-lg:grow"
                    disabled={!values.fullname || !values.phone || !!errors.fullname || !!errors.email || !!errors.phone}
                    onClick={() => setProgress(progress + 1)}
                >
                    Avanti
                </Button>
            </div>
        </>
    )
}