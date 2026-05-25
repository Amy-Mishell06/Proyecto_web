import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import clienteAxios from '../../config/axios'

const ConfirmarCuenta = () => {
    const { token } = useParams()
    const [cuentaConfirmada, setCuentaConfirmada] = useState(false)
    const [cargando, setCargando] = useState(true)
    const intentoRealizado = useRef(false)

    useEffect(() => {
        if (intentoRealizado.current) return;
        intentoRealizado.current = true;

        const confirmarCuenta = async () => {
            let exito = false;
            const roles = ['estudiante', 'docente', 'direccion'];

            for (const rol of roles) {
                try {
                    console.log(`Intentando confirmar como: ${rol}...`);
                    await clienteAxios.get(`/${rol}/confirmar/${token}`);
                    exito = true;
                    break;
                } catch (error) {
                    console.log(`Fallo intento como ${rol}`);
                }
            }

            if (exito) {
                toast.success("Cuenta confirmada exitosamente");
                setCuentaConfirmada(true);
            } else {
                toast.error("El enlace es invalido o la cuenta ya fue confirmada anteriormente.");
            }
            
            setCargando(false);
        };

        confirmarCuenta();
    }, [token])

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto border border-slate-200 mt-10 text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Verificacion de Cuenta</h1>
            
            {cargando ? (
                <div className="flex flex-col items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-slate-600 font-medium">Validando token con el servidor...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {cuentaConfirmada ? (
                        <div>
                            <p className="text-emerald-600 font-medium mb-6">Tu perfil ha sido activado. Ya puedes ingresar al sistema.</p>
                            <Link to="/auth/login" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded hover:bg-indigo-700 transition-colors">
                                Iniciar Sesion
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <p className="text-red-600 font-medium mb-6">El enlace de confirmacion ha expirado o es incorrecto.</p>
                            <Link to="/auth/registro" className="bg-slate-600 text-white font-bold py-2 px-6 rounded hover:bg-slate-700 transition-colors">
                                Crear Nueva Cuenta
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ConfirmarCuenta