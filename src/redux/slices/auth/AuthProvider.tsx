import { ReactNode, useEffect } from "react";
import { ListenToAuthChanges } from "./AuthListener";
import { useAppDispatch } from "../../../hooks/useAppDispatch";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(ListenToAuthChanges());
  }, [dispatch]);

  return (
    <>
      {children}
    </>
  );
}
