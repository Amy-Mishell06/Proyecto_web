import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import clienteAxios from '../../config/axios'
import { useAuthStore } from '../../store/authStore'

const PerfilEstudiante = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    
    const { 
        register: registerPassword, 
        handleSubmit: handleSubmitPassword, 
        reset: resetPassword 
    } = useForm()

    const { user, token, rol, setAuth } = useAuthStore()
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const { data } = await clienteAxios.get('/estudiante/perfil')
                const datosFormateados = {
                    ...data,
                    intereses: data.intereses?.join(', ') || '',
                    habilidades_tecnicas: data.habilidades_tecnicas?.join(', ') || ''
                }
                reset(datosFormateados)
            } catch (error) {
                toast.error("Error al cargar la información del perfil")
            } finally {
                setCargando(false)
            }
        }
        cargarPerfil()
    }, [reset])

    const onSubmit = async (formData) => {
        try {
            const payload = { ...formData }
            payload.intereses = typeof payload.intereses === 'string' 
                ? payload.intereses.split(',').map(item => item.trim()).filter(Boolean) 
                : payload.intereses || []
                
            payload.habilidades_tecnicas = typeof payload.habilidades_tecnicas === 'string' 
                ? payload.habilidades_tecnicas.split(',').map(item => item.trim()).filter(Boolean) 
                : payload.habilidades_tecnicas || []

            const { data } = await clienteAxios.put(`/estudiante/perfil/${user?._id}`, payload)
            
            setAuth(token, data, rol)
            toast.success("Perfil técnico actualizado con éxito")
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al actualizar el perfil")
        }
    }

    const onSubmitPassword = async (data) => {
        try {
            await clienteAxios.put('/estudiante/actualizar-password', data)
            toast.success("Contraseña actualizada correctamente")
            resetPassword() // Limpia los inputs de password
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al actualizar contraseña")
        }
    }

    if (cargando) return <div className="text-center mt-10">Cargando información...</div>

    return (
        <div className="bg-white shadow-md rounded-sm border border-slate-200 p-6 max-w-3xl mx-auto">
            <header className="mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-bold text-slate-800">Mi Perfil Técnico</h2>
            </header>

            {/* Formulario Perfil */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Nombre</label>
                        <input type="text" {...register("nombre", { required: true })} className="w-full px-3 py-2 border rounded-md bg-slate-50" readOnly />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Apellido</label>
                        <input type="text" {...register("apellido", { required: true })} className="w-full px-3 py-2 border rounded-md bg-slate-50" readOnly />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700">Intereses</label>
                    <textarea {...register("intereses")} rows="2" className="w-full px-3 py-2 border rounded-md"></textarea>
                </div>

                <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700">
                    Guardar Cambios
                </button>
            </form>

            {/* Formulario Seguridad */}
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6 mt-10 pt-6 border-t">
                <h3 className="text-xl font-bold text-slate-800">Seguridad</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Password Actual</label>
                        <input type="password" {...registerPassword("passwordactual", { required: true })} className="w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Nuevo Password</label>
                        <input type="password" {...registerPassword("passwordnuevo", { required: true })} className="w-full px-3 py-2 border rounded-md" />
                    </div>
                </div>
                <button type="submit" className="bg-slate-800 text-white font-bold py-2 px-6 rounded hover:bg-slate-900">
                    Actualizar Password
                </button>
            </form>
        </div>
    )
}

export default PerfilEstudiante