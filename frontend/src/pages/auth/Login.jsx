import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import clienteAxios from '../../config/axios'
import { useAuthStore } from '../../store/authStore'

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const navigate = useNavigate()
    const setAuth = useAuthStore((state) => state.setAuth)

    const onSubmit = async (data) => {
        try {
            const url = `/${data.rol}/login`
            const respuesta = await clienteAxios.post(url, {
                email: data.email,
                password: data.password
            })

            const { token, rol, ...user } = respuesta.data

            setAuth(token, user, rol)
            navigate(`/${rol}`)
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al iniciar sesion")
        }
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto border border-slate-200">
            <h1 className="text-2xl font-bold text-center text-slate-800 mb-6">Sistema Predictivo ESFOT</h1>
            
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
                        placeholder="usuario@epn.edu.ec"
                    />
                    {errors.email && <span className="text-xs text-red-500 mt-1 block">Campo requerido</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input
                        type="password"
                        {...register("password", { required: true })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500"
                    />
                    {errors.password && <span className="text-xs text-red-500 mt-1 block">Campo requerido</span>}
                </div>

                <div className="flex items-center justify-end mt-2">
                    <Link to="/auth/recuperarpassword" className="text-sm text-blue-600 hover:underline">
                        Olvidaste tu password?
                    </Link>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors mt-4"
                >
                    Iniciar Sesion
                </button>
            </form>

            <div className="mt-6 text-center border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-600">
                    No tienes una cuenta? <Link to="/auth/registro" className="text-blue-600 font-medium hover:underline">Registrate aqui</Link>
                </p>
            </div>
        </div>
    )
}

export default Login