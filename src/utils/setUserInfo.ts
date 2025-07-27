import { useAppDispatch } from "../store/hooks";
import { setUser } from "../store/slices/userSlice";
import { UserResponse } from "../store/interfaces/userInterfaces";

export function useSetUserInfo() {
  const dispatch = useAppDispatch();

  return (user: UserResponse) => {
    dispatch(setUser(user));
  };
}
