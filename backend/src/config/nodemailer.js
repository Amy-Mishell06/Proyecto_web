import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const transporter = nodemailer.createTransport({
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    secure: false,
    family: 4,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    },
    tls: {
        rejectUnauthorized: false
    }
})

const sendMail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: 'Sistema IA - ESFOT',
            to,
            subject,
            html,
        })
        console.log("Email enviado exitosamente: " + info.messageId)
    } catch (error) {
        console.error("Error enviando email: " + error.message)
    }
}

export default sendMail