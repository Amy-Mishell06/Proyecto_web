import { Router } from 'express'

import {
    registro,
    login,
    perfil,
    actualizarPerfil,
    actualizarPassword
} from '../controllers/estudiante_controller.js'

import { verificarTokenJWT } from '../middlewares/JWT.js'

const router = Router()


// ================= RUTAS PÚBLICAS =================

// Registro de estudiante
router.post('/registro', registro)

// Login de estudiante
router.post('/login', login)


// ================= RUTAS PRIVADAS (JWT) =================

// Obtener perfil
router.get('/perfil', verificarTokenJWT, perfil)

// Actualizar perfil
router.put('/perfil/:id', verificarTokenJWT, actualizarPerfil)

// Actualizar contraseña
router.put('/password', verificarTokenJWT, actualizarPassword)


export default router