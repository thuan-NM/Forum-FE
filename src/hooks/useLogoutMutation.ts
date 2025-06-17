import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { LogoutAccount } from "../services/AuthServices";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../store/store";
import { logout } from "../store/slices/authSlice";
import { clearUser } from "../store/slices/userSlice";

export const useLogoutMutation = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const logoutMutation = useMutation({
        mutationFn: LogoutAccount,
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["user"] });
            dispatch(logout());
            dispatch(clearUser());
            navigate("/auth");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to logout");
        },
    });

    const handleLogoutAccount = () => {
        logoutMutation.mutate();
    };

    return {
        logoutAccount: handleLogoutAccount,
    };
};