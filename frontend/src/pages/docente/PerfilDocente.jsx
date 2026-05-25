import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import clienteAxios from '../../config/axios'
import { useAuthStore } from '../../store/authStore'

const PerfilDocente = () => {
    const { register, handleSubmit, reset } = useForm()
    const { user, token, rol, setAuth } = useAuthStore()
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const { data } = await clienteAxios.get('/docente/perfil')
                const datosFormateados = {
                    ...data,
                    areas_investigacion: data.areas_investigacion?.join(', ') || '',
                    tecnologias_especialidad: data.tecnologias_especialidad?.join(', ') || ''
                }
                reset(datosFormateados)
            } catch (error) {
                toast.error("Error al cargar la configuracion del docente")
            } finally {
                setCargando(false)
            }
        }
        cargarPerfil()
    }, [reset])

    const onSubmit = async (formData) => {
        try {
            const payload = { ...formData }
            
            payload.areas_investigacion = typeof payload.areas_investigacion === 'string' 
                ? payload.areas_investigacion.split(',').map(item => item.trim()).filter(Boolean) 
                : payload.areas_investigacion || []
                
            payload.tecnologias_especialidad = typeof payload.tecnologias_especialidad === 'string' 
                ? payload.tecnologias_especialidad.split(',').map(item => item.trim()).filter(Boolean) 
                : payload.tecnologias_especialidad || []
                
            payload.cupos_maximos = Number(payload.cupos_maximos)

            const { data } = await clienteAxios.put(`/docente/perfil/${user?._id}`, payload)
            
            setAuth(token, data, rol)
            toast.success("Parametros de tutoria actualizados")
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al actualizar")
        }
    }

    if (cargando) return <div className="text-center mt-10">Cargando informacion...</div>

    return (
        <div className="bg-white shadow-md rounded-sm border border-slate-200 p-6 max-w-3xl mx-auto">
            <header className="mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-bold text-slate-800">Gestion de Cupos e Investigacion</h2>
                <p className="text-slate-500 text-sm mt-1">Configura tu disponibilidad y stack tecnologico para guiar proyectos de titulacion en la ESFOT.</p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Cupos Maximos de Tutoria</label>
                        <input type="number" min="0" max="15" {...register("cupos_maximos", { required: true })} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-blue-500" />
                    </div>
                    <div className="flex items-center mt-6">
                        <input type="checkbox" {...register("disponibilidad")} className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" id="disp" />
                        <label htmlFor="disp" className="ml-2 block text-sm text-slate-700 font-medium">Cuenta activa para recibir nuevos tesistas</label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Lineas de Investigacion</label>
                    <textarea {...register("areas_investigacion")} rows="2" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-blue-500" placeholder="Ej: Machine Learning, Gestion de Proyectos, IoT..."></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tecnologias de Especialidad</label>
                    <textarea {...register("tecnologias_especialidad")} rows="2" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-blue-500" placeholder="Ej: Python, React, Oracle SQL, C++..."></textarea>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition-colors">
                        Guardar Configuracion
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

export default PerfilDocente