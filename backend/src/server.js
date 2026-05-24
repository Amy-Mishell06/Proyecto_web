import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import estudianteRoutes from './routers/estudiante_routes.js'
import docenteRoutes from './routers/docente_routes.js'
import direccionRoutes from './routers/direccion_routes.js'


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


app.use('/api/estudiante', estudianteRoutes)
app.use('/api/docente', docenteRoutes)
app.use('/api/direccion', direccionRoutes)


// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

// Exportar app
export default app