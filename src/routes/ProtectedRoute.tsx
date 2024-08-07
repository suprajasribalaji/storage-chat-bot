import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
