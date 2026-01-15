import { useState, useEffect } from 'react';
import { CreditCard, LogOut, Menu, X, ArrowRightLeft, UserCircle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  onLogout: () => void;
}

export const DashboardLayout = ({ children, onLogout }: Props) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [userName, setUserName] = useState('Usuario');

  useEffect(() => {
    // Recuperamos el nombre del usuario guardado en el Login
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.fullName || user.name || 'Usuario'); 
    }
  }, []);

  const menuItems = [
    { icon: <CreditCard size={22} />, label: 'Mis Tarjetas' },
    { icon: <ArrowRightLeft size={22} />, label: 'Transacciones' }, // Icono para transacciones
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      <aside className={`${isExpanded ? 'w-64' : 'w-20'} bg-slate-900 transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-slate-800 h-20">
          {isExpanded && (
            <div className="flex items-center gap-2 animate-in fade-in duration-500">
              <div className="bg-[#61dafb] p-1.5 rounded-lg">
                <CreditCard size={20} className="text-slate-900" />
              </div>
              <span className="text-white font-black tracking-tighter text-xl">TARJETAS</span>
            </div>
          )}
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-slate-400 hover:text-white p-2">
            {isExpanded ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* PERFIL DE USUARIO */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <UserCircle size={isExpanded ? 40 : 32} className="text-[#61dafb] min-w-8" />
            {isExpanded && (
              <div className="overflow-hidden animate-in slide-in-from-left-2">
                <p className="text-white font-bold truncate text-sm">{userName}</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-2">
          {menuItems.map((item, index) => (
            <button key={index} className="flex items-center w-full p-3 text-slate-400 hover:bg-slate-800 hover:text-[#61dafb] rounded-xl transition-all group">
              <span className="min-w-7.5">{item.icon}</span>
              {isExpanded && <span className="font-bold text-sm ml-2">{item.label}</span>}
            </button>
          ))}
        </nav>

        <button 
          onClick={onLogout}
          className="m-3 p-3 flex items-center gap-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-500/20"
        >
          <LogOut size={22} />
          {isExpanded && <span className="font-bold text-sm">Cerrar Sesión</span>}
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
        {children}
      </main>
    </div>
  );
};