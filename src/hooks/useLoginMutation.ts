import { useMutation } from "@tanstack/react-query";
import { Login } from "../services/AuthServices";
import { loginStart, loginSuccess, loginFailure } from "../store/slices/authSlice";
import { useAppDispatch } from "../store/hooks";
import { setUser } from "../store/slices/userSlice";

export function useLoginMutation() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: Login, // Gọi API
    mutationKey: ["login"],

    onMutate: () => {
      dispatch(loginStart());
    },
    onSuccess: (data:any) => {
      dispatch(loginSuccess({ token: data.token }));
      dispatch(setUser(data.user))
    },
    onError: (error: any) => {

      let message = "Login failed";
      if (error?.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.message) {
        message = error.message;
      }

      dispatch(loginFailure(message));
    },
  });
}
