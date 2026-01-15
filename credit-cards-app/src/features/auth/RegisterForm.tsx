import { useForm } from 'react-hook-form';
import { authService } from './authService';
import toast from 'react-hot-toast';

interface Props {
  onSwitch: () => void;
}

export const RegisterForm = ({ onSwitch }: Props) => {  
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ 
    mode: "onChange" 
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: any) => {
    // Creamos una notificación de "Cargando"
    const loadingToast = toast.loading('Creando cuenta...');

    try {
      const result = await authService.register(data);
      
      if (result) {
        // Éxito: Actualizamos la notificación y limpiamos el loading
        toast.success('¡Registro exitoso! Ya puedes iniciar sesión.', {
          id: loadingToast,
          duration: 5000,
        });

        setTimeout(() => {
          onSwitch();
        }, 1500);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al conectar con el servidor";
      
      toast.error(errorMessage, {
        id: loadingToast,
        duration: 6000,
      });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Crear Cuenta</h2>
        <p className="text-sm text-slate-500 font-medium">Regístrate para gestionar tus tarjetas</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        
        {/* NOMBRE COMPLETO */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Nombre Completo</label>
          <input
            {...register("fullName", { required: "El nombre es requerido" })}
            className={`w-full px-4 py-2 bg-slate-50 border-2 rounded-xl text-slate-900 transition-all ${errors.fullName ? 'border-red-400' : 'border-slate-200'}`}
            placeholder="Juan Pérez"
          />
          {errors.fullName && <p className="text-red-500 text-xs font-bold mt-1">⚠️ {errors.fullName.message as string}</p>}
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Correo Electrónico</label>
          <input
            {...register("email", { 
              required: "El correo es requerido",
              pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Email inválido" }
            })}
            className={`w-full px-4 py-2 bg-slate-50 border-2 rounded-xl text-slate-900 transition-all ${errors.email ? 'border-red-400' : 'border-slate-200'}`}
            placeholder="usuario@ejemplo.com"
          />
          {errors.email && <p className="text-red-500 text-xs font-bold mt-1">⚠️ {errors.email.message as string}</p>}
        </div>

        {/* CONTRASEÑA CON VALIDACIONES DEL BACK */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Contraseña</label>
          <input
            type="password"
            {...register("password", { 
              required: "La contraseña es requerida.",
              minLength: { value: 8, message: "Mínimo 8 caracteres." },
              validate: {
                hasUpper: (v) => /[A-Z]/.test(v) || "Debe contener al menos una mayúscula.",
                hasLower: (v) => /[a-z]/.test(v) || "Debe contener al menos una minúscula.",
                hasNumber: (v) => /[0-9]/.test(v) || "Debe contener al menos un número.",
                hasSpecial: (v) => /[!?*.]/.test(v) || "Debe contener un carácter especial (!?*.)."
              }
            })}
            className={`w-full px-4 py-2 bg-slate-50 border-2 rounded-xl text-slate-900 transition-all ${errors.password ? 'border-red-400' : 'border-slate-200'}`}
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-500 text-xs font-bold mt-1 whitespace-pre-line">⚠️ {errors.password.message as string}</p>}
        </div>

        {/* CONFIRMAR CONTRASEÑA */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Confirmar Contraseña</label>
          <input
            type="password"
            {...register("passwordConfirmation", { 
              required: "Confirma tu contraseña",
              validate: (value) => value === passwordValue || "Las contraseñas no coinciden."
            })}
            className={`w-full px-4 py-2 bg-slate-50 border-2 rounded-xl text-slate-900 transition-all ${errors.passwordConfirmation ? 'border-red-400' : 'border-slate-200'}`}
            placeholder="••••••••"
          />
          {errors.passwordConfirmation && <p className="text-red-500 text-xs font-bold mt-1">⚠️ {errors.passwordConfirmation.message as string}</p>}
        </div>

        <button type="submit" className="w-full py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-[#61dafb] hover:text-slate-900 transition-all shadow-lg mt-4">
          REGISTRARME AHORA
        </button>

        <p className="text-center text-sm text-slate-500 mt-4 font-medium">
          ¿Ya tienes cuenta?{' '}
          <button type="button" onClick={onSwitch} className="text-blue-600 font-bold hover:underline">Inicia sesión</button>
        </p>
      </form>
    </div>
  );
};