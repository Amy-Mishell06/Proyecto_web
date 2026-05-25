import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import clienteAxios from '../../config/axios'
import { useAuthStore } from '../../store/authStore'

const PerfilEstudiante = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const { user, token, rol, setAuth } = useAuthStore()
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const { data } = await clienteAxios.get('/estudiante/perfil')
                // Transformar los arreglos en texto separado por comas para los inputs
                const datosFormateados = {
                    ...data,
                    intereses: data.intereses?.join(', ') || '',
                    habilidades_tecnicas: data.habilidades_tecnicas?.join(', ') || ''
                }
                reset(datosFormateados)
            } catch (error) {
                toast.error("Error al cargar la informacion del perfil")
            } finally {
                setCargando(false)
            }
        }
        cargarPerfil()
    }, [reset])

    const onSubmit = async (formData) => {
        try {
            const payload = { ...formData }
            // Convertir el texto separado por comas nuevamente en arreglos limpios para la IA
            payload.intereses = payload.intereses.split(',').map(item => item.trim()).filter(Boolean)
            payload.habilidades_tecnicas = payload.habilidades_tecnicas.split(',').map(item => item.trim()).filter(Boolean)

            const { data } = await clienteAxios.put(`/estudiante/perfil/${user._id}`, payload)
            
            setAuth(token, data, rol)
            toast.success("Perfil tecnico actualizado con exito")
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al actualizar el perfil")
        }
    }

    if (cargando) return <div className="text-center mt-10">Cargando informacion...</div>

    return (
        <div className="bg-white shadow-md rounded-sm border border-slate-200 p-6 max-w-3xl mx-auto">
            <header className="mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-bold text-slate-800">Mi Perfil Tecnico</h2>
                <p className="text-slate-500 text-sm mt-1">Completa tus habilidades e intereses para que el algoritmo predictivo mejore sus sugerencias de temas de tesis.</p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                        <input type="text" {...register("nombre", { required: true })} className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50 text-slate-500" readOnly title="Para cambiar tu nombre comunicate con administracion" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
                        <input type="text" {...register("apellido", { required: true })} className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50 text-slate-500" readOnly />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Correo Institucional</label>
                        <input type="email" {...register("email", { required: true })} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500" />
                        {errors.email && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Carrera (ESFOT)</label>
                        <input type="text" {...register("carrera", { required: true })} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500" />
                        {errors.carrera && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Intereses de Investigacion</label>
                    <textarea {...register("intereses")} rows="2" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500" placeholder="Ej: Internet de las Cosas, Analisis de Datos, Desarrollo Movil..."></textarea>
                    <p className="text-xs text-slate-400 mt-1">Separa cada interes con una coma.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Habilidades Tecnicas (Stack)</label>
                    <textarea {...register("habilidades_tecnicas")} rows="2" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500" placeholder="Ej: React, Python, MongoDB, Arduino..."></textarea>
                    <p className="text-xs text-slate-400 mt-1">Separa cada tecnologia con una coma. Esto es crucial para emparejarte con el tutor correcto.</p>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition-colors">
                        Guardar Cambios
                    </button>

                </div>
            </form>
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6 mt-10 pt-6 border-t border-slate-200">
            <h3 className="text-xl font-bold text-slate-800">Seguridad</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password Actual</label>
                    <input type="password" {...registerPassword("passwordactual", { required: true })} className="w-full px-3 py-2 border border-slate-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nuevo Password</label>
                    <input type="password" {...registerPassword("passwordnuevo", { required: true })} className="w-full px-3 py-2 border border-slate-300 rounded-md" />
                </div>
            </div>
            <button type="submit" className="bg-slate-800 text-white font-bold py-2 px-6 rounded hover:bg-slate-900 transition-colors">
                Actualizar Password
            </button>
            </form>
        </div>
    )
}

export default PerfilEstudiante