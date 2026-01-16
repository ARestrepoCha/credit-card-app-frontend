import { useForm } from 'react-hook-form';
import { X, ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
  initialData?: any; 
}

export const AddCardModal = ({ isOpen, onClose, onSuccess, initialData }: Props) => {
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm({
    mode: "onChange"
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Al editar, mapeamos lo que viene del GetById
        reset({
          cardHolderName: initialData.cardHolderName,
          // Mostramos el número enmascarado en el campo de texto
          cardNumber: initialData.maskedNumber, 
          expirationMonth: initialData.expirationMonth,
          expirationYear: initialData.expirationYear,
          cvv: '***' // Placeholder visual ya que el CVV no se suele retornar
        });
      } else {
        reset({
          cardHolderName: '',
          cardNumber: '',
          expirationMonth: '',
          expirationYear: '',
          cvv: ''
        });
      }
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: any) => {
    // Si estamos editando, según tu endpoint, solo enviamos estos 3 campos
    if (initialData) {
      const updatePayload = {
        cardHolderName: data.cardHolderName,
        expirationMonth: data.expirationMonth,
        expirationYear: data.expirationYear
      };
      onSuccess(updatePayload);
    } else {
      onSuccess(data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="relative p-8 bg-slate-900 text-white">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#61dafb] p-2 rounded-lg">
              <ShieldCheck size={24} className="text-slate-900" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">
              {initialData ? 'Editar Tarjeta' : 'Nueva Tarjeta'}
            </h2>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            {initialData ? 'Actualizando datos de seguridad' : 'Registra tu nuevo producto'}
          </p>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5" autoComplete="off">
          
          {/* NOMBRE DEL TITULAR */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Nombre en la tarjeta</label>
            <input 
              {...register("cardHolderName", { required: "El nombre es obligatorio" })}
              className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl outline-none transition-all ${errors.cardHolderName ? 'border-red-400' : 'border-slate-100 focus:border-[#61dafb]'}`}
              placeholder="EJ. ALEJANDRO RESTREPO"
            />
          </div>

          {/* NÚMERO DE TARJETA (Readonly en edición) */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1 justify-between">
              Número de tarjeta              
            </label>
            <input 
              {...register("cardNumber", { 
                required: !initialData ? "El número es obligatorio" : false,
                pattern: !initialData ? { value: /^\d{16}$/, message: "16 dígitos" } : undefined
              })}
              readOnly={!!initialData}
              className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all font-mono ${initialData ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-50 border-slate-100 focus:border-[#61dafb]'}`}
              placeholder="0000 0000 0000 0000"
            />
          </div>

          {/* EXPIRACIÓN Y CVV */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Mes</label>
              <input 
                {...register("expirationMonth", { required: true, maxLength: 2 })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-[#61dafb] text-center font-bold"
                placeholder="MM"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Año</label>
              <input 
                {...register("expirationYear", { required: true, maxLength: 2 })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-[#61dafb] text-center font-bold"
                placeholder="YY"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">CVV</label>
              <input 
                {...register("cvv", { required: !initialData })}
                type="password"
                readOnly={!!initialData}
                className={`w-full px-4 py-3 border-2 rounded-xl outline-none text-center ${initialData ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-slate-50 border-slate-100 focus:border-[#61dafb]'}`}
                placeholder="***"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-slate-900 text-[#61dafb] font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98] mt-4 uppercase tracking-wider"
          >
            {initialData ? 'Guardar Cambios' : 'Registrar Tarjeta'}
          </button>
        </form>
      </div>
    </div>
  );
};