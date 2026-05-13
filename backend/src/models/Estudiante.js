import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'

const estudianteSchema = new Schema({

    nombre: {
        type: String,
        required: true,
        trim: true
    },

    apellido: {
        type: String,
        required: true,
        trim: true
    },

    carrera: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    intereses: {
        type: [String],
        default: []
    },

    status: {
        type: Boolean,
        default: true
    },

    token: {
        type: String,
        default: null
    },

    confirmEmail: {
        type: Boolean,
        default: false
    },

    rol: {
        type: String,
        default: "estudiante"
    }

}, {
    timestamps: true
})


// Método para cifrar password
estudianteSchema.methods.encryptPassword = async function(password) {

    const salt = await bcrypt.genSalt(10)
    const passwordEncrypt = await bcrypt.hash(password, salt)

    return passwordEncrypt
}


// Método para verificar password
estudianteSchema.methods.matchPassword = async function(password) {

    const response = await bcrypt.compare(password, this.password)

    return response
}


// Método para generar token
estudianteSchema.methods.createToken = function() {

    const tokenGenerado = Math.random().toString(36).slice(2)

    this.token = tokenGenerado

    return tokenGenerado
}


export default model('Estudiante', estudianteSchema)