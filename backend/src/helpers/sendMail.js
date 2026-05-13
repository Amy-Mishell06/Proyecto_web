import sendMail from "../config/nodemailer.js"


const sendMailToRegister = (userMail, token) => {

    return sendMail(

        userMail,

        "Bienvenido al Sistema de Tesis TSDS 📚",

        `
            <h1>Confirma tu cuenta</h1>

            <p>
                Hola estudiante, haz clic en el siguiente enlace
                para confirmar tu cuenta:
            </p>

            <a href="${process.env.URL_BACKEND}confirmar/${token}">
                Confirmar cuenta
            </a>

            <hr>

            <footer>
                El equipo del Sistema Inteligente de Recomendación
                de Tesis te da la bienvenida.
            </footer>
        `
    )
}

export {
    sendMailToRegister
}