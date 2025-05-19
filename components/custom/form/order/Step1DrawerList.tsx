import React from "react"

// shad
import { Separator } from "@/components/ui/separator"

// icons
import { ChevronRight } from "lucide-react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interfaces
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface Step1DrawerProps {
    list: Record<string, string>[];
    getSelected: (data: Record<string, string>) => void;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Step1DrawerList({ list, getSelected }: Step1DrawerProps) {
    return (
        list.map((el, i) => (
            <React.Fragment key={i}>
                <div className="cursor-pointer flex items-center justify-between" onClick={() => getSelected(el)}>
                    <div className="space-y-2">
                        <h2 className="text-xl text-primary">{el.name}</h2>
                        <p className="flex items-center gap-2">
                            <span>Base: {el.price}</span>
                            <span className="text-primary">XL: {el.maxi}</span>
                        </p>
                        <p className="text-muted-foreground text-sm">{el.ingredients}</p>

                    </div>
                    <ChevronRight className="size-6 text-muted-foreground" />
                </div>
                <Separator />
            </React.Fragment>
        ))
    )
}