// Replit Auth integration - javascript_log_in_with_replit blueprint
import { useAppData } from "@/context/app-data";

export function useAuth() {
  const {
    user,
    isPro,
    isLoggedIn,
    authenticateUser,
    login,
    logout,
  } = useAppData();

  return {
    user,
    isLoading: false,
    isAuthenticated: isLoggedIn,
    isPro,
    authenticate: authenticateUser,
    login,
    logout,
  };
}
