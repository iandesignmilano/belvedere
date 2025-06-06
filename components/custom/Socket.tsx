"use client"

import { useEffect, createContext, useContext, useState } from "react"

// components
import { ToastSuccess } from "@/components/custom/Toast"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

type SocketContextType = {
    updateData: string
    setUpdateData: React.Dispatch<React.SetStateAction<string>>
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// context
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const SocketContext = createContext<SocketContextType | undefined>(undefined)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// hook
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export function useSocket() {
    const context = useContext(SocketContext)
    if (!context) throw new Error('useSocket deve essere usato dentro SocketProvider')
    return context
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function SocketProvider({ children }: { children: React.ReactNode }) {

    const [updateData, setUpdateData] = useState("")

    // --------------------------------------------------------------
    // web socket
    // --------------------------------------------------------------

    useEffect(() => {

        // chrome://settings/content/sound
        // abilito permessi sito
        const reservationAudio = new Audio('/audio/reservation.mp3')
        reservationAudio.load()

        const orderAudio = new Audio('/audio/order.mp3')
        orderAudio.load()

        const socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL as string)

        socket.onopen = () => console.log('WebSocket connesso')
        socket.onerror = (error) => console.error('WebSocket errore:', error)
        socket.onclose = () => console.log('WebSocket chiuso')

        socket.onmessage = async (event) => {

            if (event.data.includes("prenotazione")) {
                reservationAudio.play().catch((err) => { console.log(err) })
                setUpdateData("reservation")
            }

            if (event.data.includes("ordine")) {
                orderAudio.play().catch((err) => { console.log(err) })
                setUpdateData("order")
            }

            ToastSuccess(event.data || "")
        }
        return () => socket.close()
    }, [])

    // --------------------------------------------------------------
    // code
    // --------------------------------------------------------------

    return (
        <SocketContext.Provider value={{ updateData, setUpdateData }}>
            {children}
        </SocketContext.Provider>
    )
}