import { useForm } from 'react-hook-form';
import { X, ShoppingBag, AlertCircle } from 'lucide-react';

export const AddPaymentModal = ({ isOpen, onClose, onSuccess, cardInfo }: any) => {
  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue, // Usaremos setValue para formatear manualmente
    formState: { errors } 
  } = useForm({ mode: "onChange" });

  if (!isOpen) return null;

  // Función para formatear el valor con puntos de miles
  const formatDisplay = (value: string) => {
    const rawValue = value.replace(/\D/g, ""); // Quita todo lo que no sea número
    return rawValue === "" ? "" : new Intl.NumberFormat('es-CO').format(parseInt(rawValue));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDisplay(e.target.value);
    setValue("amountDisplay", formatted, { shouldValidate: true });
  };

  const onSubmit = (data: any) => {
    // Limpiamos los puntos antes de enviar al servicio (ej: "1.500.000" -> 1500000)
    const numericValue = parseFloat(data.amountDisplay.replace(/\./g, ""));
    
    onSuccess({
      creditCardId: cardInfo.id,
      amount: numericValue,
      productDescription: data.productDescription
    });
    reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden">
        
        {/* HEADER */}
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#61dafb] p-2 rounded-lg"><ShoppingBag size={20} className="text-slate-900" /></div>
            <h2 className="font-black uppercase tracking-tight text-lg">Nueva Compra</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
          {/* INFO TARJETA */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
            <p className="text-[10px] text-slate-400 font-black uppercase">Tarjeta: {cardInfo?.maskedNumber || cardInfo?.maskedCardNumber}</p>
          </div>
          
          {/* DESCRIPCIÓN */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase mb-1.5 ml-1">Descripción</label>
            <input 
              {...register("productDescription", { required: "Campo obligatorio" })} 
              className={`w-full p-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${errors.productDescription ? 'border-red-400' : 'border-slate-100 focus:border-[#61dafb]'}`}
              placeholder="Producto o servicio adquirido" 
            />
          </div>

          {/* MONTO CON MÁSCARA */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase mb-1.5 ml-1">Monto (COP)</label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                <input 
                  type="text" // Cambiado a text para permitir el formato visual
                  {...register("amountDisplay", { 
                    required: "El monto es obligatorio",
                    validate: (value) => {
                        const num = parseFloat(value.replace(/\./g, ""));
                        return num > 0 || "El monto debe ser mayor a 0";
                    }
                  })} 
                  onChange={handleInputChange} // Manejamos el cambio para poner los puntos
                  className={`w-full p-4 pl-8 bg-slate-50 border-2 rounded-2xl outline-none transition-all font-bold text-lg ${
                    errors.amountDisplay ? 'border-red-400' : 'border-slate-100 focus:border-[#61dafb]'
                  }`}
                  placeholder="0" 
                />
            </div>
            {errors.amountDisplay && (
              <span className="flex items-center gap-1 text-red-500 text-[10px] font-bold mt-1 uppercase">
                <AlertCircle size={12} /> {errors.amountDisplay.message as string}
              </span>
            )}
          </div>

          <button type="submit" className="w-full py-4 bg-slate-900 text-[#61dafb] font-black rounded-[1.2rem] shadow-xl hover:bg-slate-800 transition-all uppercase tracking-widest text-sm">
            CONFIRMAR PAGO
          </button>
        </form>
      </div>
    </div>
  );
};