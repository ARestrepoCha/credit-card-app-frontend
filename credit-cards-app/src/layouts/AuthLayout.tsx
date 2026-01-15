import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';

interface Props {
  children: React.ReactNode;
  title: string;
  description: string;
}

export const AuthLayout = ({ children, title, description }: Props) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* LADO IZQUIERDO: FIJO */}
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-900 p-10 shadow-2xl z-10">
        <div className="flex gap-8 mb-6">
          <img src={viteLogo} className="h-20 w-20" alt="Vite" />
          <img src={reactLogo} className="h-20 w-20 animate-pulse" alt="React" />
        </div>
        <h1 className="text-4xl font-bold text-[#61dafb] text-center uppercase tracking-wider">
          {title}
        </h1>
        <p className="mt-4 text-slate-400 text-center font-light max-w-xs">
          {description}
        </p>
      </div>

      {/* LADO DERECHO: DINÁMICO */}
      <div className="flex-1 flex items-center justify-center p-8 transition-all duration-500">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
};