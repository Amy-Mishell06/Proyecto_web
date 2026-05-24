import Docente from "../models/Docente.js"
import { sendMailToRegister } from "../helpers/sendMail.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose"

const registro = async (req, res) => {
    try {
        const { email } = req.body
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Debes llenar todos los campos" })
        }
        const existeEmail = await Docente.findOne({ email })
        if (existeEmail) {
            return res.status(400).json({ msg: "El email ya esta registrado" })
        }
        const nuevoDocente = new Docente(req.body)
        const token = nuevoDocente.createToken()
        await sendMailToRegister(email, token)
        await nuevoDocente.save()
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
        const docenteBDD = await Docente.findOne({ email })
        if (!docenteBDD) {
            return res.status(404).json({ msg: "El docente no esta registrado" })
        }
        if (!docenteBDD.confirmEmail) {
            return res.status(403).json({ msg: "Debes confirmar tu cuenta" })
        }
        const verificarPassword = await docenteBDD.matchPassword(password)
        if (!verificarPassword) {
            return res.status(401).json({ msg: "Password incorrecto" })
        }
        const token = crearTokenJWT(docenteBDD._id, docenteBDD.rol)
        const { nombre, apellido, areas_investigacion, tecnologias_especialidad, cupos_maximos, _id, rol } = docenteBDD
        res.status(200).json({ token, rol, nombre, apellido, areas_investigacion, tecnologias_especialidad, cupos_maximos, _id, email: docenteBDD.email })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const perfil = (req, res) => {
    const { token, confirmEmail, createdAt, updatedAt, __v, password, ...datosPerfil } = req.docente._doc || req.docente
    res.status(200).json(datosPerfil)
}

const actualizarPerfil = async (req, res) => {
    try {
        const { id } = req.params
        const { nombre, apellido, email, areas_investigacion, tecnologias_especialidad, cupos_maximos, disponibilidad } = req.body
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: `ID invalido: ${id}` })
        }
        const docenteBDD = await Docente.findById(id)
        if (!docenteBDD) {
            return res.status(404).json({ msg: "Docente no encontrado" })
        }
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Debes llenar todos los campos" })
        }
        if (docenteBDD.email !== email) {
            const emailExistente = await Docente.findOne({ email })
            if (emailExistente) {
                return res.status(400).json({ msg: "El email ya esta registrado" })
            }
        }
        docenteBDD.nombre = nombre ?? docenteBDD.nombre
        docenteBDD.apellido = apellido ?? docenteBDD.apellido
        docenteBDD.areas_investigacion = areas_investigacion ?? docenteBDD.areas_investigacion
        docenteBDD.tecnologias_especialidad = tecnologias_especialidad ?? docenteBDD.tecnologias_especialidad
        docenteBDD.cupos_maximos = cupos_maximos ?? docenteBDD.cupos_maximos
        docenteBDD.disponibilidad = disponibilidad ?? docenteBDD.disponibilidad
        docenteBDD.email = email ?? docenteBDD.email
        await docenteBDD.save()
        res.status(200).json(docenteBDD)
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const actualizarPassword = async (req, res) => {
    try {
        const docenteBDD = await Docente.findById(req.docente._id)
        if (!docenteBDD) {
            return res.status(404).json({ msg: "Usuario no encontrado" })
        }
        const verificarPassword = await docenteBDD.matchPassword(req.body.passwordactual)
        if (!verificarPassword) {
            return res.status(400).json({ msg: "El password actual no es correcto" })
        }
        docenteBDD.password = req.body.passwordnuevo
        await docenteBDD.save()
        res.status(200).json({ msg: "Password actualizado correctamente" })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

export { registro, login, perfil, actualizarPerfil, actualizarPassword }