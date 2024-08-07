import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { ListenToAuthChanges } from "../redux/slices/auth/AuthListener";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const isLoading = useSelector((state: RootState) => state.authListener.isLoading);

  useEffect(() => {
    const initAuth = async () => {
      await dispatch(ListenToAuthChanges());
    };
    initAuth();
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/login');
    }
  }, [isLoading, currentUser, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return currentUser ? <>{children}</> : null;
};

export default ProtectedRoute;