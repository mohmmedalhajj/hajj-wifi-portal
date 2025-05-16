
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-soft p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
          <div className="mx-auto bg-red-100 w-16 h-16 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">غير مصرح بالدخول</h1>
          <p className="text-gray-600">يجب تسجيل الدخول كمسؤول للوصول إلى هذه الصفحة</p>
          <Navigate to="/admin-login" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
