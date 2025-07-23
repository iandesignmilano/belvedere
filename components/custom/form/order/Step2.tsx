// formik
import { FormikErrors, FormikTouched } from "formik"

// shad
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// icons
import { House, Bike } from "lucide-react"

// interface
import { OrderBase, AddressProps } from "@/actions/orders"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface Step1Props {
    values: OrderBase
    errors: FormikErrors<OrderBase>
    touched: FormikTouched<OrderBase>
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void
    setFieldValue: <K extends keyof OrderBase>(field: K, value: OrderBase[K], shouldValidate?: boolean) => void
    setProgress: React.Dispatch<React.SetStateAction<number>>
    progress: number
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Step2({ values, errors, touched, handleBlur, handleChange, setFieldValue, progress, setProgress }: Step1Props) {

    const errorAddress = errors.address as FormikErrors<AddressProps> | undefined
    const touchedAddress = touched.address as FormikTouched<AddressProps> | undefined

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
                            className={errorAddress?.street && touchedAddress?.street ? "custom-form-error" : ""}
                        />
                        {errorAddress?.street && touchedAddress?.street && (
                            <p className="text-destructive text-sm pl-3">{errorAddress.street}</p>
                        )}
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
                            className={errorAddress?.street_number && touchedAddress?.street_number ? "custom-form-error" : ""}
                        />
                        {errorAddress?.street_number && touchedAddress?.street_number && (
                            <p className="text-destructive text-sm pl-3">{errorAddress.street_number}</p>
                        )}
                    </div>

                    <div className="space-y-2 lg:col-span-2">
                        <Label className="text-base pl-3">Città</Label>
                        <Input
                            name="address.city"
                            placeholder="Città"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values?.address?.city}
                            className={errorAddress?.city && touchedAddress?.city ? "custom-form-error" : ""}
                        />
                        {errorAddress?.city && touchedAddress?.city && (
                            <p className="text-destructive text-sm pl-3">{errorAddress.city}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-base pl-3">Cap</Label>
                        <Input
                            name="address.cap"
                            placeholder="Cap"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values?.address?.cap}
                            className={errorAddress?.cap && touchedAddress?.cap ? "custom-form-error" : ""}
                        />
                        {errorAddress?.cap && touchedAddress?.cap && (
                            <p className="text-destructive text-sm pl-3">{errorAddress.cap}</p>
                        )}
                    </div>
                </div>
            )}

            <div className="lg:col-span-2 flex gap-4 max-lg:flex-col-reverse justify-between">
                <Button
                    className="custom-button custom-button-outline !text-lg max-lg:w-full"
                    variant="outline"
                    type="button"
                    onClick={() => setProgress(progress - 1)}
                >
                    Indietro
                </Button>
                <Button
                    type="button"
                    className="custom-button !text-lg max-lg:w-full"
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