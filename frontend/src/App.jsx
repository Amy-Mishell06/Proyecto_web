import { Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'

import Login from './pages/auth/Login'
import Registro from './pages/auth/Registro'
import ConfirmarCuenta from './pages/auth/ConfirmarCuenta'
import RecuperarPassword from './pages/auth/RecuperarPassword'
import NuevoPassword from './pages/auth/NuevoPassword'

import Recomendaciones from './pages/estudiante/Recomendaciones'
import PerfilEstudiante from './pages/estudiante/PerfilEstudiante'

import SolicitudesEntrantes from './pages/docente/SolicitudesEntrantes'
import PerfilDocente from './pages/docente/PerfilDocente'

import DashboardGeneral from './pages/direccion/DashboardGeneral'
import AuditoriaTramites from './pages/direccion/AuditoriaTramites'

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/auth/login" replace />} />

            <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="registro" element={<Registro />} />
                <Route path="confirmar/:token" element={<ConfirmarCuenta />} />
                <Route path="recuperarpassword" element={<RecuperarPassword />} />
                <Route path="nuevopassword/:token" element={<NuevoPassword />} />
            </Route>

            <Route path="/estudiante" element={<DashboardLayout rolesPermitidos={['estudiante']} />}>
                <Route index element={<Recomendaciones />} />
                <Route path="perfil" element={<PerfilEstudiante />} />
            </Route>

            <Route path="/docente" element={<DashboardLayout rolesPermitidos={['docente']} />}>
                <Route index element={<SolicitudesEntrantes />} />
                <Route path="perfil" element={<PerfilDocente />} />
            </Route>

            <Route path="/direccion" element={<DashboardLayout rolesPermitidos={['direccion']} />}>
                <Route index element={<DashboardGeneral />} />
                <Route path="auditoria" element={<AuditoriaTramites />} />
            </Route>

            <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
    )
}

export default App