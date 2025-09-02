import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMe, login, logout } from "./auth";
import { User } from "@/types/auth";

function useAuth() {
  const queryClient = useQueryClient();

  const userQuery = useQuery<User>({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false, 
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
    login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const logoutMutation = () => {
    logout();
    queryClient.clear();
    
  };

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    login: loginMutation,
    logout: logoutMutation,
  };
}

export default useAuth;