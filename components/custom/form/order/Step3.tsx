// formik
import { FormikErrors, FormikTouched } from "formik"

// shad
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/datePicker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

type initialValue = {
    date: string | undefined;
    time: string;
}

interface Step3Props {
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

export default function Step3({ values, errors, touched, setFieldValue, progress, setProgress }: Step3Props) {
    return (
        <>
            <div className="space-y-2">
                <Label className="text-base pl-3">Data prenotazione</Label>
                <DatePicker
                    placeholder="Data prenotazione"
                    onChange={(date) => {
                        setFieldValue('date', date)
                        setFieldValue('time', "")
                    }}
                    value={values.date}
                    className={errors.date && touched.date ? "custom-form-error" : ""}
                />
                {errors.date && touched.date && <p className="text-red-500 text-sm pl-3">{errors.date}</p>}
            </div>

            <div className="space-y-2">
                <Label className="text-base pl-3">Orari disponibili</Label>
                <Select
                    value={values.time}
                    onValueChange={(value) => setFieldValue('time', value)}
                    disabled={!values.date}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Orari disponibili" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="19:30">19:30</SelectItem>
                        <SelectItem value="20:00">20:00</SelectItem>
                        <SelectItem value="20:30">20:30</SelectItem>
                    </SelectContent>
                </Select>
                {!values.date && <p className="text-sm pl-3 text-muted-foreground">Seleziona una data per vedere gli orari</p>}
                {errors.time && touched.time && <p className="text-red-500 text-sm pl-3">{errors.time}</p>}
            </div>

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
                    disabled={!values.date || !values.time || !!errors.date || !!errors.time}
                    onClick={() => setProgress(progress + 1)}
                >
                    Avanti
                </Button>
            </div>
        </>
    )
}

