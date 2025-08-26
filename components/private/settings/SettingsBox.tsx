"use client"

import { useState } from "react"

// shad
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

// components
import { ToastDanger, ToastSuccess } from "@/components/custom/Toast"

// icons
import { Plus, Minus } from "lucide-react"

// action
import { ActionProps, updateSettingsAction } from "@/actions/settings"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface SettingsBoxProps {
    privileges: string
    settingsData: ActionProps | null
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function SettingsBox({ privileges, settingsData }: SettingsBoxProps) {

    // --------------------------------------------------------------
    // data
    // --------------------------------------------------------------

    const defaultData = {
        _id: "",
        teglie: 6,
        prenotazione: 1.5,
        stop_prenotazioni: false,
        stop_ordini: false
    }

    const [settings, setSettings] = useState(settingsData ?? defaultData)

    // --------------------------------------------------------------
    // update
    // --------------------------------------------------------------

    async function updateSettings() {
        try {
            const res = await updateSettingsAction(settings)
            if (!res.success) ToastDanger()
            ToastSuccess("Impostazioni aggiornate con successo!")
        } catch { ToastDanger() }
    }

    // --------------------------------------------------------------
    // privileges
    // --------------------------------------------------------------

    if (privileges !== "all") {
        return (
            <h2 className="text-xl text-destructive">
                Non hai i privilegi per accedere a questa pagina
            </h2>
        )
    }

    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------

    return (
        <Card>
            <CardHeader>
                <CardTitle>Settaggi piattaforma</CardTitle>
                <CardDescription>Gestisci la piattaforma</CardDescription>
            </CardHeader>
            <CardContent className="gap-6 flex flex-col">
                <Separator />
                <section className="space-y-2">
                    <Label className="text-base pl-3">Numero di teglie (ogni 10 min)</Label>
                    <div className="flex gap-2">
                        <Input
                            name="people"
                            type="number"
                            disabled
                            value={settings.teglie}
                            className="disabled:opacity-100"
                        />
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                className="h-full !px-4 !text-lg"
                                onClick={() => setSettings(s => ({ ...s, teglie: s.teglie + 1 }))}
                            >
                                <Plus className="size-4" />
                            </Button>
                            <Button
                                type="button"
                                className="h-full !px-4 !text-lg"
                                disabled={settings.teglie == 1}
                                onClick={() => setSettings(s => ({ ...s, teglie: s.teglie - 1 }))}
                            >
                                <Minus className="size-4" />
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="space-y-2">
                    <Label className="text-base pl-3">Step prenotazione (ore)</Label>
                    <div className="flex gap-2">
                        <Input
                            name="people"
                            type="number"
                            disabled
                            value={settings.prenotazione}
                            className="disabled:opacity-100"
                        />
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                className="h-full !px-4 !text-lg"
                                onClick={() => setSettings(s => ({ ...s, prenotazione: s.prenotazione + 0.5 }))}
                            >
                                <Plus className="size-4" />
                            </Button>
                            <Button
                                type="button"
                                className="h-full !px-4 !text-lg"
                                disabled={settings.prenotazione == 0.5}
                                onClick={() => setSettings(s => ({ ...s, prenotazione: s.prenotazione - 0.5 }))}
                            >
                                <Minus className="size-4" />
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="flex gap-3 p-3 rounded-xl border items-center">
                    <Switch
                        checked={settings.stop_prenotazioni}
                        onCheckedChange={(checked) => setSettings(s => ({ ...s, stop_prenotazioni: checked }))}
                    />
                    <Label className="text-base">Stop prenotazioni online</Label>
                </section>

                <section className="flex gap-3 p-3 rounded-xl border items-center">
                    <Switch
                        checked={settings.stop_ordini}
                        onCheckedChange={(checked) => setSettings(s => ({ ...s, stop_ordini: checked }))}
                    />
                    <Label className="text-base">Stop ordini online</Label>
                </section>

                <Separator />
            </CardContent>
            <CardFooter className="justify-end">
                <Button className="custom-button max-lg:w-full" onClick={updateSettings}>
                    Salva
                </Button>
            </CardFooter>
        </Card>
    )
}