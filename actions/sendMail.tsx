"use server"

// email
import nodemailer from "nodemailer"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// conf
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const configOptions = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.IANDESIGN_USER,
        pass: process.env.IANDESIGN_PASS
    }
}

const transporter = nodemailer.createTransport(configOptions)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// inteface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface sendMailWorkProps {
    fullname: string
    email: string
    phone: string
    message: string
    file: File | null
    privacy: boolean
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function sendMailWorkAction(formData: sendMailWorkProps) {

    try {

        // message
        const message = {
            from: "Website <website@iandesign.it>",
            to: "riky.ianna12@gmail.com",
            subject: "Nuova candidatura",
            html: (`
                <p><strong>Nome e cognome:</strong> ${formData.fullname}</p>
                <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
                <p><strong>Telefono:</strong> <a href="tel:+39${formData.phone}">${formData.phone}</a></p>
                <p><strong>Messaggio:</strong> ${formData.message || "Nessun messagio presente"}</p>
            `),
            ...(formData.file && {
                attachments: [
                    {
                        filename: `curriculum-${formData.fullname}.pdf`,
                        content: Buffer.from(await formData.file.arrayBuffer())
                    }
                ]
            })
        }

        // verify
        await transporter.verify()

        // send
        await transporter.sendMail(message)

        // success
        return { success: true }

    } catch { throw new Error("Errore durante l'invio dell'email") }

}