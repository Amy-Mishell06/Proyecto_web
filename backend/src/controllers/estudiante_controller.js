import Estudiante from "../models/Estudiante.js"
import { sendMailToRegister } from "../helpers/sendMail.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose"


// ================= REGISTRO =================
const registro = async (req, res) => {

    try {

        const { email, password } = req.body

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({
                msg: "Debes llenar todos los campos"
            })
        }

        const existeEmail = await Estudiante.findOne({ email })

        if (existeEmail) {
            return res.status(400).json({
                msg: "El email ya está registrado"
            })
        }

        const nuevoEstudiante = new Estudiante(req.body)

        nuevoEstudiante.password =
            await nuevoEstudiante.encryptPassword(password)

        const token = nuevoEstudiante.createToken()

        await sendMailToRegister(email, token)

        await nuevoEstudiante.save()

        res.status(200).json({
            msg: "Revisa tu correo para confirmar tu cuenta"
        })

    } catch (error) {
        res.status(500).json({
            msg: `❌ Error en el servidor - ${error}`
        })
    }
}


// ================= LOGIN =================
const login = async (req, res) => {

    try {

        const { email, password } = req.body

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({
                msg: "Debes llenar todos los campos"
            })
        }

        const estudianteBDD = await Estudiante.findOne({ email })

        if (!estudianteBDD) {
            return res.status(404).json({
                msg: "El estudiante no está registrado"
            })
        }

        if (!estudianteBDD.confirmEmail) {
            return res.status(403).json({
                msg: "Debes confirmar tu cuenta"
            })
        }

        const verificarPassword =
            await estudianteBDD.matchPassword(password)

        if (!verificarPassword) {
            return res.status(401).json({
                msg: "Password incorrecto"
            })
        }

        // Crear JWT
        const token = crearTokenJWT(
            estudianteBDD._id,
            estudianteBDD.rol
        )

        const {
            nombre,
            apellido,
            carrera,
            celular,
            _id,
            rol
        } = estudianteBDD

        res.status(200).json({
            token,
            rol,
            nombre,
            apellido,
            carrera,
            celular,
            _id,
            email: estudianteBDD.email
        })

    } catch (error) {
        res.status(500).json({
            msg: `❌ Error en el servidor - ${error}`
        })
    }
}


// ================= PERFIL =================
const perfil = (req, res) => {

    const {
        token,
        confirmEmail,
        createdAt,
        updatedAt,
        __v,
        ...datosPerfil
    } = req.estudiante

    res.status(200).json(datosPerfil)
}


// ================= ACTUALIZAR PERFIL =================
const actualizarPerfil = async (req, res) => {

    try {

        const { id } = req.params
        const { nombre, apellido, carrera, celular, email } = req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                msg: `ID inválido: ${id}`
            })
        }

        const estudianteBDD = await Estudiante.findById(id)

        if (!estudianteBDD) {
            return res.status(404).json({
                msg: "Estudiante no encontrado"
            })
        }

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({
                msg: "Debes llenar todos los campos"
            })
        }

        if (estudianteBDD.email !== email) {

            const emailExistente = await Estudiante.findOne({ email })

            if (emailExistente) {
                return res.status(400).json({
                    msg: "El email ya está registrado"
                })
            }
        }

        estudianteBDD.nombre = nombre ?? estudianteBDD.nombre
        estudianteBDD.apellido = apellido ?? estudianteBDD.apellido
        estudianteBDD.carrera = carrera ?? estudianteBDD.carrera
        estudianteBDD.celular = celular ?? estudianteBDD.celular
        estudianteBDD.email = email ?? estudianteBDD.email

        await estudianteBDD.save()

        res.status(200).json(estudianteBDD)

    } catch (error) {
        res.status(500).json({
            msg: `❌ Error en el servidor - ${error}`
        })
    }
}


// ================= ACTUALIZAR PASSWORD =================
const actualizarPassword = async (req, res) => {

    try {

        const estudianteBDD =
            await Estudiante.findById(req.estudiante._id)

        if (!estudianteBDD) {
            return res.status(404).json({
                msg: "Usuario no encontrado"
            })
        }

        const verificarPassword =
            await estudianteBDD.matchPassword(req.body.passwordactual)

        if (!verificarPassword) {
            return res.status(400).json({
                msg: "El password actual no es correcto"
            })
        }

        estudianteBDD.password =
            await estudianteBDD.encryptPassword(req.body.passwordnuevo)

        await estudianteBDD.save()

        res.status(200).json({
            msg: "Password actualizado correctamente"
        })

    } catch (error) {
        res.status(500).json({
            msg: `❌ Error en el servidor - ${error}`
        })
    }
}


// ================= EXPORT =================
export {
    registro,
    login,
    perfil,
    actualizarPerfil,
    actualizarPassword
}