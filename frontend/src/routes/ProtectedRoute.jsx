import { Navigate } from "react-router"
import { useAuthStore } from "../store/authStore"


const ProtectedRoute = ({ children }) => {

    const token = useAuthStore(state => state.token)
    
    return token ?  children  : <Navigate to="/login" replace />
}

export default ProtectedRoute