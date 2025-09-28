// src/hooks/useAuth.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi, logoutApi, checkAuthApi } from "@/api/authApi";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./use-local-storage";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  // localStorage dan auth state ni olish
  const [authData, setAuthData] = useLocalStorage("auth", {
    isAuthenticated: false,
    user: null,
    token: null
  });

  // ✅ Load initial auth state - localStorage dan yoki API dan
  const { data, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: checkAuthApi,
    initialData: authData,
    enabled: !authData.isAuthenticated, // Agar localStorage da ma'lumot bo'lsa, API ga so'rov bermaslik
  });

  // ✅ Login mutation
  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (response) => {
      const newAuthData = {
        isAuthenticated: true,
        user: response.user,
        token: response.token
      };
      
      // React Query cache ga saqlash
      queryClient.setQueryData(["auth"], newAuthData);
      
      // localStorage ga saqlash
      setAuthData(newAuthData);
    },
  });

  // ✅ Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      const newAuthData = {
        isAuthenticated: false,
        user: null,
        token: null
      };
      
      // React Query cache dan o'chirish
      queryClient.setQueryData(["auth"], newAuthData);
      
      // localStorage dan o'chirish
      setAuthData(newAuthData);
      
      // Boshqa cache larni ham tozalash
      queryClient.clear();
      
      navigate("/login", { replace: true });
    },
  });

  return {
    isAuthenticated: data?.isAuthenticated ?? false,
    user: data?.user ?? null,
    token: data?.token ?? null,
    isLoading,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
  };
};
