import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import clienteAxios from '../../config/axios'

const RecuperarPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = async (data) => {
        try {
            const url = `/${data.rol}/recuperarpassword`
            const respuesta = await clienteAxios.post(url, { email: data.email })
            toast.success(respuesta.data.msg)
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al procesar la solicitud")
        }
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto border border-slate-200 mt-10">
            <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">Restablecer Password</h1>
            <p className="text-sm text-center text-slate-600 mb-6">Ingresa tu correo institucional y te enviaremos las instrucciones.</p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Perfil de Acceso</label>
                    <select
                        {...register("rol", { required: true })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 bg-white text-slate-700"
                    >
                        <option value="estudiante">Estudiante</option>
                        <option value="docente">Docente</option>
                        <option value="direccion">Direccion Academica</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Correo Institucional</label>
                    <input
                        type="email"
                        {...register("email", { required: true })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500"
                    />
                    {errors.email && <span className="text-xs text-red-500 mt-1 block">Campo requerido</span>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors mt-4"
                >
                    Enviar Instrucciones
                </button>
            </form>

            <div className="mt-6 text-center border-t border-slate-200 pt-4">
                <Link to="/auth/login" className="text-sm text-blue-600 font-medium hover:underline">
                    Volver al Inicio de Sesion
                </Link>
            </div>
        </div>
    )
}

export default RecuperarPassword