import Estudiante from "../models/Estudiante.js"
import { sendMailToRegister } from "../helpers/sendMail.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose"

const registro = async (req, res) => {
    try {
        const { email } = req.body
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Debes llenar todos los campos" })
        }
        const existeEmail = await Estudiante.findOne({ email })
        if (existeEmail) {
            return res.status(400).json({ msg: "El email ya esta registrado" })
        }
        const nuevoEstudiante = new Estudiante(req.body)
        const token = nuevoEstudiante.createToken()
        await sendMailToRegister(email, token)
        await nuevoEstudiante.save()
        res.status(200).json({ msg: "Revisa tu correo para confirmar tu cuenta" })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Debes llenar todos los campos" })
        }
        const estudianteBDD = await Estudiante.findOne({ email })
        if (!estudianteBDD) {
            return res.status(404).json({ msg: "El estudiante no esta registrado" })
        }
        if (!estudianteBDD.confirmEmail) {
            return res.status(403).json({ msg: "Debes confirmar tu cuenta" })
        }
        const verificarPassword = await estudianteBDD.matchPassword(password)
        if (!verificarPassword) {
            return res.status(401).json({ msg: "Password incorrecto" })
        }
        const token = crearTokenJWT(estudianteBDD._id, estudianteBDD.rol)
        const { nombre, apellido, carrera, intereses, habilidades_tecnicas, _id, rol } = estudianteBDD
        res.status(200).json({ token, rol, nombre, apellido, carrera, intereses, habilidades_tecnicas, _id, email: estudianteBDD.email })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const perfil = (req, res) => {
    const { token, confirmEmail, createdAt, updatedAt, __v, password, ...datosPerfil } = req.estudiante._doc || req.estudiante
    res.status(200).json(datosPerfil)
}

const actualizarPerfil = async (req, res) => {
    try {
        const { id } = req.params
        const { nombre, apellido, carrera, email, intereses, habilidades_tecnicas } = req.body
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: `ID invalido: ${id}` })
        }
        const estudianteBDD = await Estudiante.findById(id)
        if (!estudianteBDD) {
            return res.status(404).json({ msg: "Estudiante no encontrado" })
        }
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Debes llenar todos los campos" })
        }
        if (estudianteBDD.email !== email) {
            const emailExistente = await Estudiante.findOne({ email })
            if (emailExistente) {
                return res.status(400).json({ msg: "El email ya esta registrado" })
            }
        }
        estudianteBDD.nombre = nombre ?? estudianteBDD.nombre
        estudianteBDD.apellido = apellido ?? estudianteBDD.apellido
        estudianteBDD.carrera = carrera ?? estudianteBDD.carrera
        estudianteBDD.intereses = intereses ?? estudianteBDD.intereses
        estudianteBDD.habilidades_tecnicas = habilidades_tecnicas ?? estudianteBDD.habilidades_tecnicas
        estudianteBDD.email = email ?? estudianteBDD.email
        await estudianteBDD.save()
        res.status(200).json(estudianteBDD)
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const actualizarPassword = async (req, res) => {
    try {
        const estudianteBDD = await Estudiante.findById(req.estudiante._id)
        if (!estudianteBDD) {
            return res.status(404).json({ msg: "Usuario no encontrado" })
        }
        const verificarPassword = await estudianteBDD.matchPassword(req.body.passwordactual)
        if (!verificarPassword) {
            return res.status(400).json({ msg: "El password actual no es correcto" })
        }
        estudianteBDD.password = req.body.passwordnuevo
        await estudianteBDD.save()
        res.status(200).json({ msg: "Password actualizado correctamente" })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

export { registro, login, perfil, actualizarPerfil, actualizarPassword }