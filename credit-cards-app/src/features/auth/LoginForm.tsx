import { useForm } from 'react-hook-form';
import { authService } from './authService';
import toast from 'react-hot-toast';

// 1. Agregamos onSwitch a la interfaz
interface Props {
  onLoginSuccess: () => void;
  onSwitch: () => void;
}

export const LoginForm = ({ onLoginSuccess, onSwitch }: Props) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ 
    mode: "onChange" 
  });

  const onSubmit = async (formData: any) => {
  const loadId = toast.loading('Verificando credenciales...');
  try {
    const response = await authService.login(formData);    
    const apiData = response.data; 

    if (apiData && apiData.token) {
      localStorage.setItem('token', apiData.token);
      
      localStorage.setItem('user', JSON.stringify({
        id: apiData.id,
        fullName: apiData.fullName,
        email: apiData.email
      }));

      toast.success(`¡Bienvenido, ${apiData.fullName}!`, { id: loadId });
      
      setTimeout(() => onLoginSuccess(), 1000);
    } else {
      toast.error("No se recibieron datos válidos", { id: loadId });
    }    
  } catch (error: any) {
    const msg = error.response?.data?.message || "Credenciales incorrectas";
    toast.error(msg, { id: loadId });
  }
};

  return (
    <div className="animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Iniciar Sesión</h2>
        <p className="text-slate-500 font-medium">Ingresa para gestionar tus tarjetas</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* CORREO */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Correo Electrónico</label>
          <input 
            {...register("email", { 
              required: "El correo es requerido",
              pattern: { 
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                message: "Formato de correo no válido" 
              }
            })} 
            className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-[#61dafb] ${
              errors.email ? 'border-red-400' : 'border-slate-200'
            }`} 
            type="email"
            placeholder="usuario@correo.com"
          />
          {errors.email && <p className="text-red-500 text-xs font-bold mt-1">⚠️ {errors.email.message as string}</p>}
        </div>

        {/* CONTRASEÑA */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Contraseña</label>
          <input 
            {...register("password", { 
              required: "La contraseña es requerida",
              minLength: { value: 6, message: "La contraseña es demasiado corta" }
            })} 
            className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-[#61dafb] ${
              errors.password ? 'border-red-400' : 'border-slate-200'
            }`} 
            type="password"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-500 text-xs font-bold mt-1">⚠️ {errors.password.message as string}</p>}
        </div>

        <button 
          type="submit" 
          className="w-full py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-[#61dafb] hover:text-slate-900 transition-all shadow-lg"
        >
          INGRESAR
        </button>

        {/* 2. Ahora onSwitch ya existe y no dará error */}
        <p className="text-center text-sm text-slate-500 mt-4 font-medium">
          ¿No tienes cuenta? 
          <button 
            type="button" 
            onClick={onSwitch} 
            className="ml-2 text-blue-600 font-bold hover:underline"
          >
            Regístrate aquí
          </button>
        </p>
      </form>
    </div>
  );
};