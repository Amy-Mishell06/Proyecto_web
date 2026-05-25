import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import clienteAxios from '../../config/axios'

const Registro = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            rol: 'estudiante'
        },
        shouldUnregister: true
    })
    const navigate = useNavigate()
    const rolSeleccionado = watch('rol')

    const onSubmit = async (data) => {
        try {
            const payload = { ...data }

            if (payload.rol === 'docente' && payload.areas_investigacion) {
                payload.areas_investigacion = payload.areas_investigacion.split(',').map(item => item.trim())
            }

            const url = `/${payload.rol}/registro`
            const respuesta = await clienteAxios.post(url, payload)

            toast.success(respuesta.data.msg)
            navigate('/auth/login')
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al procesar el registro")
        }
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto border border-slate-200 my-8">
            <h1 className="text-2xl font-bold text-center text-slate-800 mb-6">Crear Cuenta</h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Perfil</label>
                    <select
                        {...register("rol", { required: true })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 bg-white text-slate-700"
                    >
                        <option value="estudiante">Estudiante</option>
                        <option value="docente">Docente</option>
                        <option value="direccion">Direccion Academica</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                        <input
                            type="text"
                            {...register("nombre", { required: true })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                        {errors.nombre && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
                        <input
                            type="text"
                            {...register("apellido", { required: true })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                        {errors.apellido && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Correo Institucional</label>
                    <input
                        type="email"
                        {...register("email", { required: true })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500"
                        placeholder="usuario@epn.edu.ec"
                    />
                    {errors.email && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                </div>

                {rolSeleccionado === 'estudiante' && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Carrera</label>
                        <input
                            type="text"
                            {...register("carrera", { required: true })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500"
                            placeholder="Ej. Desarrollo de Software"
                        />
                        {errors.carrera && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                    </div>
                )}

                {rolSeleccionado === 'docente' && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Areas de Investigacion</label>
                        <input
                            type="text"
                            {...register("areas_investigacion", { required: true })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500"
                            placeholder="Separadas por comas (IA, Datos)"
                        />
                        {errors.areas_investigacion && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                    </div>
                )}

                {rolSeleccionado === 'direccion' && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Cargo</label>
                        <input
                            type="text"
                            {...register("cargo", { required: true })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500"
                            placeholder="Ej. Coordinador"
                        />
                        {errors.cargo && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input
                        type="password"
                        {...register("password", { required: true })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500"
                    />
                    {errors.password && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors mt-6"
                >
                    Registrarse
                </button>
            </form>

            <div className="mt-6 text-center border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-600">
                    Ya tienes una cuenta? <Link to="/auth/login" className="text-blue-600 font-medium hover:underline">Inicia Sesion</Link>
                </p>
            </div>
        </div>
    )
}

export default Registro