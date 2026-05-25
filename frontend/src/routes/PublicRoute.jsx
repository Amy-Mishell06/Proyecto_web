import { Navigate, Outlet } from "react-router"
import { useAuthStore } from "../store/authStore"



const PublicRoute = () => {

    const token = useAuthStore(state => state.token)
    
    return token ? <Navigate to="/dashboard" /> : <Outlet />
}

export default PublicRoute