// pdf
import { jsPDF } from "jspdf"

// interface
import { OrdersProps } from "@/actions/orders"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function OrderPdf(order: OrdersProps, height: number, type: string) {

    const width = 8
    const padding = 0.2

    const doc = new jsPDF({ unit: "cm", format: [width, height] })
    let y = 1

    // title
    if (type == "delivery") {
        doc.setFontSize(12)
        doc.text("Pizzeria Belvedere", padding, y)
        y += 0.8
    }

    // data
    doc.setFontSize(8)
    doc.text(`Codice ordine: ${order.code}`, padding, y)
    y += 0.5

    doc.text(`Nominativo: ${order.fullname}`, padding, y)
    y += 0.5

    doc.text(`Data e orario: ${order.date} - ${order.time}`, padding, y)
    if (type == "delivery") y += 0.5
    else y += 0.8

    if (type == "delivery") {
        doc.text(`Pagamento: ${order.pay == "home" ? "Pagamento alla consegna" : "Pagato online con carta"}`, padding, y)
        y += 0.8
    }

    // address
    if (type == "delivery") {
        doc.setFontSize(8)
        doc.text(`Consegna: ${order.type == "domicile" ? "Domicilio" : "Asporto"}`, padding, y)
        if (order.type == "domicile") y += 0.5
        else y += 0.8

        if (order.type == "domicile") {
            doc.text(`Indirizzo: ${order.address?.street} - ${order.address?.street_number}`, padding, y)
            y += 0.5

            doc.text(`Città: ${order.address?.city} - ${order.address?.cap}`, padding, y)
            y += 0.8
        }
    }

    // detail
    order.order.forEach((item) => {

        doc.setFontSize(8)
        doc.setFont("helvetica", "normal")
        doc.text(`${item.name} X ${item.quantity} - ${type == "kitchen" && item.type.toUpperCase()}`, padding, y)
        y += 0.4

        doc.setFontSize(6)
        if (item.ingredients && item.ingredients?.length > 0) {
            const ingredientsText = item.ingredients.map(ing => ing.name).join(", ")
            doc.text(`${ingredientsText}`, padding, y)
            y += 0.4
        }

        if (item.removed && item.removed?.length > 0) {
            item.removed.map((el) => {
                doc.text(`- ${el.name}`, padding, y)
                y += 0.4
            })
        }

        if (item.custom && item.custom?.length > 0) {
            item.custom.map((el) => {
                doc.text(`+ ${el.name}`, padding, y)
                y += 0.4
            })
        }

        doc.setFont("helvetica", "bold")
        doc.text(`Totale: ${item.total}`, padding, y)
        y += 0.8
    })


    // open
    const blob = doc.output("blob")
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank")
}