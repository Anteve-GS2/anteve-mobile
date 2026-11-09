import { useAuth } from '@/context/AuthContext';

export function useRole() {
  const { user } = useAuth();
  return { papel: user?.papel, isGestor: user?.papel === 'GESTOR' };
}