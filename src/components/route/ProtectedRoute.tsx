import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const location = useLocation();

  console.log(" =======>>>> ", 'current user in protected route: ', currentUser, ' ; loading: ', isLoading);
  
  if (isLoading) return <div>Loading...</div>;
  
  if(!currentUser) return <Navigate to="/login" state={{from: location}} replace/>;
  
  return children;
};

export default ProtectedRoute;