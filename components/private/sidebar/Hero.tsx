import React from "react";

// shad
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface HeroProps {
    path: { name: string; link?: string; }[];
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Hero({ path }: HeroProps) {
    return (
        <section className="px-4 py-4 w-full md:py-2">
            <div className="bg-sidebar px-4 py-2 rounded-md border-sidebar-border border flex gap-4 items-center">
                <SidebarTrigger className="hover:bg-primary hover:text-white cursor-pointer" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {path.map((el, index) => {
                            if (el.link) {
                                return (
                                    <React.Fragment key={index}>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href={el.link}>{el.name}</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                    </React.Fragment>
                                )
                            }
                            return (
                                <BreadcrumbItem key={index}>
                                    <BreadcrumbPage className="text-primary">{el.name}</BreadcrumbPage>
                                </BreadcrumbItem>
                            )
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </section>
    )
}