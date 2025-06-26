"use client"

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

export default function TablesList({ tables, privileges }: { tables: TablesProps[], privileges: string }) {
    return (
        <>
            {(privileges === "all" || privileges.includes("create")) && (
                <>
                    <div className="text-right">
                        <FormTables type="create">
                            <Button className="custom-button max-lg:w-full">Aggiungi tavoli</Button>
                        </FormTables>
                    </div>
                    <Separator />
                </>
            )}
            <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
                {tables.map((el) => (
                    <React.Fragment key={el._id}>
                        <div className="space-y-4 p-4 rounded-xl border">
                            <h2 className="text-xl text-primary">Nome tavolo: {el.name}</h2>
                            <h4 className="text-xl">Posti: {el.people}</h4>
                            <Separator />

                            <h4 className="text-xl">Tavolo: {el.union || "--"}</h4>
                            <h4 className="text-xl">Posti: {el.max || el.people}</h4>

                            <Separator />
                            {(privileges == "all" || privileges.includes('update') || privileges.includes('delete')) && (
                                <div className="flex items-center justify-between gap-4">
                                    {(privileges == "all" || privileges.includes('update')) && (
                                        <div className="grow">
                                            <FormTables type="update" id={el._id}>
                                                <Button className="custom-button !text-sm w-full">
                                                    <Pen />
                                                </Button>
                                            </FormTables>
                                        </div>
                                    )}
                                    {(privileges == "all" || privileges.includes('delete')) && <DeleteTable id={el._id} />}
                                </div>
                            )}
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </>
    )
}