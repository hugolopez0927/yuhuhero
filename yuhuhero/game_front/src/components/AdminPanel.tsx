import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Datos simulados de usuarios
const MOCK_USERS = [
  { id: 'user-1', name: 'Carlos Pérez', phone: '555-123-4567', quizCompleted: true, created_at: '2023-01-15T14:30:00Z' },
  { id: 'user-2', name: 'María López', phone: '555-987-6543', quizCompleted: false, created_at: '2023-02-20T10:15:00Z' },
  { id: 'user-3', name: 'Juan García', phone: '555-456-7890', quizCompleted: true, created_at: '2023-03-05T16:45:00Z' },
  { id: 'user-4', name: 'Ana Martínez', phone: '555-321-0987', quizCompleted: false, created_at: '2023-04-10T09:20:00Z' },
];

// Datos simulados de misiones
const MOCK_MISSIONS = [
  { id: 'mission-intro', title: 'Introducción a Finanzas', type: 'quiz', completions: 12 },
  { id: 'mission-savings', title: 'Ahorro', type: 'lesson', completions: 8 },
  { id: 'mission-investment', title: 'Inversión', type: 'challenge', completions: 5 },
  { id: 'mission-debt', title: 'Deudas', type: 'lesson', completions: 7 },
];

// Tipos de tabs para el panel
type TabType = 'users' | 'missions' | 'stats';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [searchTerm, setSearchTerm] = useState('');

  // Manejar logout de admin
  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    toast.info('Has cerrado sesión como administrador');
    navigate('/admin');
  };

  // Filtrar usuarios por término de búsqueda
  const filteredUsers = MOCK_USERS.filter((user) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Panel de Administración</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Cerrar sesión
          </button>
        </div>
      </header>
      
      {/* Tabs */}
      <div className="bg-white shadow">
        <div className="container mx-auto">
          <div className="flex">
            <button
              className={`px-4 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('users')}
            >
              Usuarios
            </button>
            <button
              className={`px-4 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'missions' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('missions')}
            >
              Misiones
            </button>
            <button
              className={`px-4 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'stats' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('stats')}
            >
              Estadísticas
            </button>
          </div>
        </div>
      </div>
      
      {/* Contenido */}
      <div className="container mx-auto py-6 px-4">
        {/* Tab de Usuarios */}
        {activeTab === 'users' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Gestión de Usuarios</h2>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
                  className="flex-1 px-4 py-2 border rounded-l"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700">
                  Buscar
                </button>
              </div>
            </div>
            
            {/* Tabla de usuarios */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quiz Completado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Registro
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {user.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.quizCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.quizCompleted ? 'Completado' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-2">
                          Ver
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Tab de Misiones */}
        {activeTab === 'missions' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Gestión de Misiones</h2>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                + Nueva Misión
              </button>
            </div>
            
            {/* Lista de misiones */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_MISSIONS.map((mission) => (
                <div key={mission.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-800">{mission.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded ${
                      mission.type === 'quiz' ? 'bg-blue-100 text-blue-800' :
                      mission.type === 'lesson' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {mission.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">ID: {mission.id}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {mission.completions} completados
                    </span>
                    <div>
                      <button className="text-blue-600 hover:text-blue-900 mr-2">
                        Editar
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Tab de Estadísticas */}
        {activeTab === 'stats' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Estadísticas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-gray-500 text-sm mb-2">Total Usuarios</div>
                <div className="flex items-center">
                  <div className="text-3xl font-bold text-gray-800">{MOCK_USERS.length}</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-gray-500 text-sm mb-2">Quizzes Completados</div>
                <div className="flex items-center">
                  <div className="text-3xl font-bold text-gray-800">
                    {MOCK_USERS.filter(u => u.quizCompleted).length}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    ({Math.round((MOCK_USERS.filter(u => u.quizCompleted).length / MOCK_USERS.length) * 100)}%)
                  </span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-gray-500 text-sm mb-2">Total Misiones</div>
                <div className="flex items-center">
                  <div className="text-3xl font-bold text-gray-800">{MOCK_MISSIONS.length}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Actividad Reciente</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <div className="text-sm font-medium">María López se registró</div>
                  <div className="text-xs text-gray-500">Hace 2 días</div>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-1">
                  <div className="text-sm font-medium">Juan García completó el quiz financiero</div>
                  <div className="text-xs text-gray-500">Hace 5 días</div>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4 py-1">
                  <div className="text-sm font-medium">Nueva misión añadida: Inversión</div>
                  <div className="text-xs text-gray-500">Hace 1 semana</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 