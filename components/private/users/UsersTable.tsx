// interface
import { UsersData } from "@/actions/users"

// icons
import { Star, CircleCheck, CircleX, User, Pen } from "lucide-react"

// shad
import { Button } from "../../ui/button"
import { Separator } from "../../ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// components
import DeleteUser from "./DeleteUser"
import FormUser from "@/components/custom/form/FormUser"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface UsersTableProps {
    users: UsersData[]
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// privileges
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const privilegesMap = [
    { label: 'modifica', key: 'update' },
    { label: 'crea', key: 'create' },
    { label: 'elimina', key: 'delete' }
]

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function UsersTable({ users }: UsersTableProps) {
    return (
        <>
            <div className="grid lg:grid-cols-2 gap-4">
                <div></div>
                <div className="text-right">
                    <FormUser type="create">
                        <Button className="custom-button max-lg:w-full">Aggiungi utente</Button>
                    </FormUser>
                </div>
            </div>
            <Separator />
            <section className="grid lg:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
                {users.map((el) => {

                    return (
                        <section key={el._id} className="bg-card text-card-foreground flex flex-col gap-4 rounded-xl border p-4 shadow-sm">
                            <div>
                                <div className={`rounded-full p-2 text-ms inline-block ${el.superuser ? "text-white bg-primary" : "text-primary bg-slate-300"}`}>
                                    {el.superuser ? <Star className="size-4" /> : <User className="size-4" />}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl text-primary">{el.fullname}</h2>
                                <h4 className="text-sm">{el.email}</h4>
                            </div>
                            <Separator />
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="py-0 text-muted-foreground">Privilegi utente</AccordionTrigger>
                                    <AccordionContent className="space-y-4 mt-4 pb-0">
                                        {privilegesMap.map((privilege, i) => {

                                            const hasPrivilege = el.superuser || el.privileges?.includes(privilege.key)

                                            return (
                                                <p
                                                    className={`text-sm flex items-center gap-2 ${hasPrivilege ? "text-green-600" : "text-destructive"}`}
                                                    key={i}
                                                >
                                                    {hasPrivilege ? <CircleCheck className="size-4" /> : <CircleX className="size-4" />}
                                                    {privilege.label}
                                                </p>
                                            )
                                        })}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <Separator />
                            <div className="flex items-center justify-between gap-4">
                                <div className="grow">
                                    <FormUser type="update" id={el._id}>
                                        <Button className="custom-button !text-sm w-full">
                                            <Pen />
                                        </Button>
                                    </FormUser>
                                </div>
                                <DeleteUser id={el._id} />
                            </div>
                        </section>
                    )
                })}
            </section>
        </>
    )
}