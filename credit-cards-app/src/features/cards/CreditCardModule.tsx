import { useEffect, useState } from 'react';
import { 
  Plus, 
  CreditCard as CardIcon, 
  Edit2, 
  RefreshCcw, 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag 
} from 'lucide-react';
import { cardService } from './cardService';
import { AddCardModal } from './AddCardModal';
import { TransactionHistory } from '../payments/TransactionHistory';
import toast from 'react-hot-toast';

export const CreditCardModule = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // ESTADOS PARA NAVEGACIÓN Y EDICIÓN
  const [view, setView] = useState<'LIST' | 'HISTORY'>('LIST');
  const [selectedCard, setSelectedCard] = useState<any>(null);
  
  // ESTADOS PARA PAGINACIÓN DE TARJETAS
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchCards = async () => {
    try {
      const response = await cardService.getAll();
      setCards(response.data || []);
    } catch (error) {
      toast.error("Error al cargar tarjetas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCards(); }, []);

  // Lógica de Paginación Local para la lista de tarjetas
  const totalPages = Math.ceil(cards.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cards.slice(indexOfFirstItem, indexOfLastItem);

  // MANEJO DE CREACIÓN Y EDICIÓN
  const handleFormSubmit = async (formData: any) => {
    const loadId = toast.loading(selectedCard ? 'Actualizando...' : 'Guardando...');
    try {
      if (selectedCard) {
        await cardService.update(selectedCard.id, formData);
        toast.success("Tarjeta actualizada", { id: loadId });
      } else {
        await cardService.create(formData);
        toast.success("Tarjeta agregada", { id: loadId });
      }
      closeModal();
      fetchCards();
    } catch (error) {
      toast.error("Hubo un error en la operación", { id: loadId });
    }
  };

  const handleToggleStatus = async (id: string) => {
    const loadId = toast.loading('Cambiando estado...');
    try {
      await cardService.toggleStatus(id);
      toast.success("Estado actualizado", { id: loadId });
      fetchCards();
    } catch (error) {
      toast.error("Error al cambiar estado", { id: loadId });
    }
  };

  const openEditModal = async (id: string) => {
    const loadId = toast.loading('Cargando información detallada...');
    try {
      const response = await cardService.getById(id);
      if (response.status && response.data) {
        setSelectedCard(response.data);
        setIsModalOpen(true);
        toast.dismiss(loadId);
      }
    } catch (error) {
      toast.error("Error al obtener datos", { id: loadId });
    }
  };

  const closeModal = () => {
    setSelectedCard(null);
    setIsModalOpen(false);
  };

  // VISTA DE HISTORIAL
  if (view === 'HISTORY') {
    return (
      <TransactionHistory 
        card={selectedCard} 
        onBack={() => {
          setView('LIST');
          setSelectedCard(null);
          fetchCards();
        }} 
      />
    );
  }

  if (loading) return <div className="p-10 text-center font-bold text-slate-400 animate-pulse">Cargando tarjetas...</div>;

  return (
    <div className="animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Mis Tarjetas</h1>
          <p className="text-slate-500 font-medium">Gestiona tus productos registrados ({cards.length})</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center justify-center gap-2 bg-slate-900 text-[#61dafb] px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all"
        >
          <Plus size={20} /> NUEVA TARJETA
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 flex flex-col items-center text-center">
           <CardIcon size={48} className="text-slate-300 mb-4" />
           <h3 className="text-xl font-bold text-slate-700">No hay tarjetas</h3>
           <button onClick={() => setIsModalOpen(true)} className="mt-4 text-blue-600 font-bold hover:underline">Registra la primera aquí</button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase">Titular</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase">Número</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase text-center">Expiración</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase text-center">Estado</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentItems.map((card) => (
                  <tr key={card.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-700 uppercase text-sm">{card.cardHolderName}</td>
                    <td className="p-4 text-slate-500 font-mono text-sm">{card.maskedNumber}</td>
                    <td className="p-4 text-center text-slate-500 text-sm font-bold">{card.expirationMonth}/{card.expirationYear}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm ${card.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                        {card.isActive ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {/* Botón Ver Historial / Comprar */}
                        <button 
                          onClick={() => { setSelectedCard(card); setView('HISTORY'); }}
                          className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
                          title="Pagos e Historial"
                        >
                          <ShoppingBag size={18} />
                        </button>

                        <button 
                          onClick={() => openEditModal(card.id)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        
                        <button 
                          onClick={() => handleToggleStatus(card.id)}
                          className={`p-2 rounded-lg transition-colors border border-transparent ${card.isActive ? 'hover:bg-red-50 text-red-400 hover:text-red-600' : 'hover:bg-emerald-50 text-emerald-400 hover:text-emerald-600'}`} 
                          title={card.isActive ? "Desactivar" : "Activar"}
                        >
                          <RefreshCcw size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINACIÓN */}
          <div className="flex items-center justify-between mt-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">
              Página <span className="text-slate-900">{currentPage}</span> de {totalPages || 1}
            </span>
            <div className="flex gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-2 border-2 border-slate-100 rounded-xl disabled:opacity-20 hover:bg-slate-50 transition-all text-slate-600"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-2 bg-slate-900 text-[#61dafb] rounded-xl disabled:opacity-20 hover:bg-slate-800 transition-all shadow-lg"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </>
      )}

      <AddCardModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSuccess={handleFormSubmit} 
        initialData={selectedCard}
      />
    </div>
  );
};