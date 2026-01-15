import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginForm } from './features/auth/LoginForm';
import { RegisterForm } from './features/auth/RegisterForm';
import { CreditCardModule } from './features/cards/CreditCardModule';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setIsLoginView(true); // Aseguramos que vuelva al login y no al registro
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-center" />
        <AuthLayout 
          title="CARD APP" 
          description={isLoginView ? "Seguridad y control en tus manos." : "Únete a la mejor gestión de tarjetas."}
        >
          {isLoginView ? (
            <LoginForm 
              onLoginSuccess={() => setIsAuthenticated(true)} 
              onSwitch={() => setIsLoginView(false)} 
            />
          ) : (
            <RegisterForm onSwitch={() => setIsLoginView(true)} />
          )}
        </AuthLayout>
      </>
    );
  }

  return (
    <DashboardLayout onLogout={handleLogout}>
      <Toaster position="bottom-right" />
      <CreditCardModule />
    </DashboardLayout>
  );
}