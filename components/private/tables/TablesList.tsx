import React from "react"

// shad
import { Button } from "../../ui/button"
import { Separator } from "../../ui/separator"

// interface
import { TablesProps } from "@/actions/tables"

// components
import DeleteTable from "./DeleteTable"
import FormTables from "@/components/custom/form/FormTables"

// icons
import { Pen } from "lucide-react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function TablesList({ tables }: { tables: TablesProps[] }) {
    return (
        <>
            <div className="text-right">
                <FormTables type="create">
                    <Button className="custom-button max-lg:w-full">Aggiungi tavoli</Button>
                </FormTables>

            </div>
            <Separator />
            <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
                {tables.map((el) => (
                    <React.Fragment key={el._id}>
                        <div className="space-y-4 p-4 rounded-xl border text-center">
                            <h2 className="text-xl text-primary">Tavoli per {el.people} persone</h2>
                            <h4 className="text-primary bg-slate-200 p-4 rounded-xl text-4xl">{el.total}</h4>
                            <div className="flex items-center justify-between gap-4">
                                <div className="grow">
                                    <FormTables type="update" id={el._id}>
                                        <Button className="custom-button !text-sm w-full">
                                            <Pen />
                                        </Button>
                                    </FormTables>
                                </div>
                                <DeleteTable id={el._id} />
                            </div>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </>
    )
}