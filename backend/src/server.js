import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import estudianteRoutes from './routers/estudiante_routes.js'


// Inicializaciones
const app = express()
dotenv.config()


// Configuraciones



// Middlewares
app.use(express.json())
app.use(cors())
app.use('/api', estudianteRoutes)


// Variables globales
app.set('port', process.env.PORT || 3000)


// Ruta principal
app.get('/', (req, res) => {
    res.send("API Sistema Inteligente de Recomendación de Tesis")
})


// Exportar app
export default app