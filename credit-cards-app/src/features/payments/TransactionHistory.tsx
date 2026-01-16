import { useEffect, useState, useCallback } from 'react';
import { paymentService } from './paymentService';
import { ArrowLeft, PlusCircle, Calendar, Tag, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { AddPaymentModal } from './AddPaymentModal';
import toast from 'react-hot-toast';

export const TransactionHistory = ({ card, onBack }: any) => {
  const [history, setHistory] = useState<any>(null);
  const [page, setPage] = useState(1); // Ahora sí tenemos setPage
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageSize = 10; // Cantidad de registros por página

  const fetchHistory = useCallback(async () => {
    try {
      // Pasamos cardId, página actual y tamaño de página
      const res = await paymentService.getHistory(card.id, page, pageSize);
      setHistory(res.data);
    } catch (error) {
      toast.error("Error al cargar historial");
    }
  }, [card.id, page]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handlePayment = async (data: any) => {
    const loadId = toast.loading('Procesando pago...');
    try {
      await paymentService.createPayment(data);
      toast.success("Pago registrado con éxito", { id: loadId });
      setIsModalOpen(false);
      setPage(1); // Volvemos a la página 1 para ver la compra reciente
      fetchHistory();
    } catch (error) {
      toast.error("Error al procesar el pago", { id: loadId });
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-500 h-[calc(100vh-180px)] flex flex-col">
      {/* HEADER Y TARJETA (Se mantienen fijos arriba) */}
      <div className="shrink-0">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors uppercase text-xs tracking-widest">
            <ArrowLeft size={20} /> Volver a tarjetas
          </button>
          
          {card.isActive && (
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-black shadow-lg shadow-emerald-100 hover:scale-105 transition-all uppercase text-xs">
              <PlusCircle size={20} /> Nueva Compra
            </button>
          )}
        </div>

        <div className="bg-slate-900 rounded-3xl p-6 text-white mb-6 flex justify-between items-center shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[#61dafb] text-[10px] font-black uppercase tracking-[0.3em] mb-1">{card.cardType}</p>
            <h3 className="text-xl font-bold uppercase tracking-tight">{card.cardHolderName}</h3>
            <p className="font-mono text-slate-400 text-sm mt-1 tracking-widest">{card.maskedNumber || card.maskedCardNumber}</p>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border-2 ${card.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            {card.isActive ? '● Activa' : '○ Inactiva'}
          </div>
        </div>
      </div>

      {/* TÍTULO DE LISTADO */}
      <div className="flex justify-between items-end mb-4 shrink-0">
          <h4 className="font-black text-slate-800 uppercase tracking-tighter text-lg">Movimientos</h4>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total: {history?.totalCount || 0}</span>
      </div>
      
      {/* CONTENEDOR DE LISTA CON SCROLL PROPIO */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
        {!history || history.items.length === 0 ? (
          <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-slate-100 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
            No hay transacciones
          </div>
        ) : (
          <div className="grid gap-3 pb-4">
            {history.items.map((item: any) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center hover:shadow-md transition-all group">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-50 p-2.5 rounded-xl text-slate-400 group-hover:bg-slate-900 group-hover:text-[#61dafb] transition-colors">
                      <Tag size={18}/>
                  </div>
                  <div>
                    <p className="font-black text-slate-800 uppercase text-xs tracking-tight leading-none mb-1">{item.productDescription}</p>
                    <p className="text-[9px] text-slate-400 flex items-center gap-1 font-bold uppercase">
                      <Calendar size={10}/> {new Date(item.transactionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900 text-base flex items-center justify-end tracking-tighter">
                      <DollarSign size={14} className="text-slate-300"/>
                      {new Intl.NumberFormat('es-CO').format(item.amount)}
                  </p>
                  <span className="text-[8px] font-black text-emerald-500 uppercase italic tracking-tighter">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAGINACIÓN FIJA ABAJO */}
      {history && history.items.length > 0 && (
        <div className="shrink-0 pt-4 mt-auto">
          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-100 shadow-lg">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] ml-2">
                  Pág. <span className="text-slate-900">{history.pageNumber}</span> / {history.totalPages}
              </span>
              <div className="flex gap-2">
                  <button 
                      disabled={!history.hasPreviousPage}
                      onClick={() => {
                        setPage(p => p - 1);
                        document.querySelector('.overflow-y-auto')?.scrollTo(0,0);
                      }}
                      className="p-2 border-2 border-slate-50 rounded-xl disabled:opacity-20 hover:bg-slate-50 text-slate-600 transition-all"
                  >
                      <ChevronLeft size={18} />
                  </button>
                  <button 
                      disabled={!history.hasNextPage}
                      onClick={() => {
                        setPage(p => p + 1);
                        document.querySelector('.overflow-y-auto')?.scrollTo(0,0);
                      }}
                      className="p-2 bg-slate-900 text-[#61dafb] rounded-xl disabled:opacity-20 hover:bg-slate-800 shadow-lg transition-all"
                  >
                      <ChevronRight size={18} />
                  </button>
              </div>
          </div>
        </div>
      )}

      <AddPaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handlePayment} cardInfo={card} />
    </div>
  );
};