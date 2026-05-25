import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import clienteAxios from '../../config/axios'

const NuevoPassword = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [tokenValido, setTokenValido] = useState(false)
    const [rolDetectado, setRolDetectado] = useState('')

    useEffect(() => {
        const comprobarToken = async () => {
            const roles = ['estudiante', 'docente', 'direccion']
            for (const rol of roles) {
                try {
                    await clienteAxios.get(`/${rol}/recuperarpassword/${token}`)
                    setTokenValido(true)
                    setRolDetectado(rol)
                    break
                } catch (error) {
                    continue
                }
            }
        }
        comprobarToken()
    }, [token])

    const onSubmit = async (data) => {
        if (data.password !== data.confirmpassword) {
            toast.error("Los passwords no coinciden")
            return
        }

        try {
            const url = `/${rolDetectado}/nuevopassword/${token}`
            const respuesta = await clienteAxios.post(url, {
                password: data.password,
                confirmpassword: data.confirmpassword
            })
            toast.success(respuesta.data.msg)
            navigate('/auth/login')
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al actualizar el password")
        }
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto border border-slate-200 mt-10">
            <h1 className="text-2xl font-bold text-center text-slate-800 mb-6">Crear Nuevo Password</h1>
            
            {tokenValido ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nuevo Password</label>
                        <input
                            type="password"
                            {...register("password", { required: true })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                        {errors.password && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Password</label>
                        <input
                            type="password"
                            {...register("confirmpassword", { required: true })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                        {errors.confirmpassword && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors mt-4"
                    >
                        Guardar Nuevo Password
                    </button>
                </form>
            ) : (
                <div className="text-center">
                    <p className="text-red-600 font-medium mb-6">El enlace de recuperacion no es valido o ya expiro.</p>
                    <Link to="/auth/recuperarpassword" className="bg-slate-600 text-white font-bold py-2 px-6 rounded hover:bg-slate-700 transition-colors">
                        Solicitar uno nuevo
                    </Link>
                </div>
            )}
        </div>
    )
}

export default NuevoPassword