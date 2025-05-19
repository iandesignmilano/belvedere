// formik
import { FormikErrors, FormikTouched } from "formik"

// shad
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// icons
import { House, Bike } from "lucide-react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

type initialValue = {
    type: string;
    address: {
        street?: string;
        street_number?: string;
        city?: string;
        cap?: string;
    }
}

interface Step1Props {
    values: initialValue;
    errors: FormikErrors<initialValue>;
    touched: FormikTouched<initialValue>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    setFieldValue: <K extends keyof initialValue>(field: K, value: initialValue[K], shouldValidate?: boolean) => void;

    setProgress: React.Dispatch<React.SetStateAction<number>>;
    progress: number;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Step1({ values, errors, touched, handleBlur, handleChange, setFieldValue, progress, setProgress }: Step1Props) {
    return (
        <>
            <div className="text-lg grid grid-cols-2 gap-8 lg:col-span-2">
                <div
                    className={`custom-form-box ${values.type == "take_away" && "custom-form-box-active"}`}
                    onClick={() => setFieldValue("type", "take_away")}
                >
                    <House className="size-8" />
                    <span>Asporto</span>
                </div>
                <div
                    className={`custom-form-box ${values.type == "domicile" && "custom-form-box-active"}`}
                    onClick={() => setFieldValue("type", "domicile")}
                >
                    <Bike className="size-8" />
                    <span>Domicilio</span>
                </div>
            </div>

            {values.type == "domicile" && (
                <div className="lg:col-span-2 grid lg:grid-cols-3 gap-8">
                    <div className="space-y-2 lg:col-span-2">
                        <Label className="text-base pl-3">Indirizzo</Label>
                        <Input
                            name="address.street"
                            placeholder="Indirizzo"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values?.address?.street}
                            className={errors?.address?.street && touched?.address?.street ? "custom-form-error" : ""}
                        />
                        {errors?.address?.street && touched?.address?.street && <p className="text-destructive text-sm pl-3">{errors.address.street}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-base pl-3">Numero civico</Label>
                        <Input
                            type="number"
                            name="address.street_number"
                            placeholder="Numero civico"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values?.address?.street_number}
                            className={errors?.address?.street_number && touched?.address?.street_number ? "custom-form-error" : ""}
                        />
                        {errors?.address?.street_number && touched?.address?.street_number && <p className="text-destructive text-sm pl-3">{errors.address.street_number}</p>}
                    </div>

                    <div className="space-y-2 lg:col-span-2">
                        <Label className="text-base pl-3">Città</Label>
                        <Input
                            name="address.city"
                            placeholder="Città"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values?.address?.city}
                            className={errors?.address?.city && touched?.address?.city ? "custom-form-error" : ""}
                        />
                        {errors?.address?.city && touched?.address?.city && <p className="text-destructive text-sm pl-3">{errors.address.city}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-base pl-3">Cap</Label>
                        <Input
                            name="address.cap"
                            placeholder="Cap"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values?.address?.cap}
                            className={errors?.address?.street && touched?.address?.cap ? "custom-form-error" : ""}
                        />
                        {errors?.address?.cap && touched?.address?.cap && <p className="text-destructive text-sm pl-3">{errors.address.cap}</p>}
                    </div>
                </div>
            )}

            <div className="lg:col-span-2 flex gap-4 justify-between">
                <Button
                    className="custom-button custom-button-outline !text-lg"
                    variant="outline"
                    type="button"
                    onClick={() => setProgress(progress - 1)}
                >
                    Indietro
                </Button>
                <Button
                    type="button"
                    className="custom-button !text-lg max-lg:grow"
                    disabled={!values.type ||
                        (values.type === "domicile" && (!values.address?.street || !values.address?.street_number || !values.address?.cap || !values.address?.city))
                    }
                    onClick={() => setProgress(progress + 1)}
                >
                    Avanti
                </Button>
            </div>
        </>
    )
}