import { useAppSelector } from "@/src/store/hooks";

export function useSession() {
  return useAppSelector((state) => state.session);
}