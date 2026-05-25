import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Dashboard = () => {
  const { isAuthenticated, rol } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-indigo-600">ESFOT Tesis</span>
            </div>
            <div className="flex space-x-4">
              {isAuthenticated ? (
                 <Link to={`/${rol}`} className="bg-indigo-600 text-white hover:bg-indigo-700 font-medium px-4 py-2 rounded-md transition-colors">Ir a mi Panel</Link>
              ) : (
                <>
                  <Link to="/auth/login" className="text-slate-600 hover:text-indigo-600 font-medium px-3 py-2 transition-colors">Iniciar Sesion</Link>
                  <Link to="/auth/registro" className="bg-indigo-600 text-white hover:bg-indigo-700 font-medium px-4 py-2 rounded-md transition-colors">Registrarse</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="text-center px-4 max-w-3xl">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-6">Sistema Inteligente de Recomendacion de Tesis</h1>
          <p className="text-lg text-slate-600 mb-8">Descubre los mejores temas y tutores para tu proyecto de titulacion en la Escuela de Formacion de Tecnologos utilizando Inteligencia Artificial.</p>
          {!isAuthenticated && (
             <Link to="/auth/registro" className="bg-indigo-600 text-white font-bold text-lg px-8 py-3 rounded-md hover:bg-indigo-700 transition-colors shadow-lg">Comenzar Ahora</Link>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;