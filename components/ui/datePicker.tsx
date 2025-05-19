"use client"

import { useState } from "react"

// date
import { format, isBefore, startOfToday, getDay } from "date-fns"
import { it } from "date-fns/locale"

// lib
import { cn } from "@/lib/utils"

// icon
import { Calendar as CalendarIcon } from "lucide-react"

// shad
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// form 
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface DatePickerProps {
    className?: string;
    placeholder: string;
    value?: string;
    onChange: (date?: string) => void;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// disabled 
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function isDisabledDate(date: Date) {
    const isMonday = getDay(date) === 1
    const beforeToday = isBefore(date, startOfToday())
    return isMonday || beforeToday
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code 
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export function DatePicker({ placeholder, value, onChange, className }: DatePickerProps) {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "custom-button custom-button-small-padding !rounded-xl bg-input w-full justify-between text-left font-normal border-input hover:bg-input hover:text-black",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    {value || placeholder}
                    <CalendarIcon className="size-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    locale={it}
                    mode="single"
                    numberOfMonths={1}
                    disabled={isDisabledDate}
                    selected={value ? new Date(value) : undefined}
                    onSelect={(date) => {
                        if (date) onChange(format(date, 'dd-MM-yyyy'))
                        setIsOpen(false)
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}
