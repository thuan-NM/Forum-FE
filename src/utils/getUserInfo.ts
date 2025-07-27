import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";

export function useGetUserInfo() {
  const user = useAppSelector((state: RootState) => state.user.user);

  return user;
}
