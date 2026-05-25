import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import clienteAxios from '../../config/axios'

const ConfirmarCuenta = () => {
    const { token } = useParams()
    const [cuentaConfirmada, setCuentaConfirmada] = useState(false)
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const confirmarCuenta = async () => {
            try {
                let exito = false
                const roles = ['estudiante', 'docente', 'direccion']

                for (const rol of roles) {
                    try {
                        await clienteAxios.get(`/${rol}/confirmar/${token}`)
                        exito = true
                        break 
                    } catch (error) {
                        continue
                    }
                }

                if (exito) {
                    toast.success("Cuenta confirmada exitosamente")
                    setCuentaConfirmada(true)
                } else {
                    toast.error("Token no valido o la cuenta ya fue confirmada")
                }
            } catch (error) {
                toast.error("Error de conexion con el servidor")
            } finally {
                setCargando(false)
            }
        }

        confirmarCuenta()
    }, [token])

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto border border-slate-200 mt-10 text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Verificacion de Cuenta</h1>
            
            {cargando ? (
                <p className="text-slate-600">Procesando validacion, por favor espera...</p>
            ) : (
                <div className="space-y-4">
                    {cuentaConfirmada ? (
                        <div>
                            <p className="text-green-600 font-medium mb-6">Tu perfil en el Sistema Predictivo ha sido activado.</p>
                            <Link to="/auth/login" className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition-colors">
                                Iniciar Sesion
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <p className="text-red-600 font-medium mb-6">El enlace es invalido o ha expirado.</p>
                            <Link to="/auth/registro" className="bg-slate-600 text-white font-bold py-2 px-6 rounded hover:bg-slate-700 transition-colors">
                                Volver al Registro
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ConfirmarCuenta