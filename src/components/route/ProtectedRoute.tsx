import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import UnauthorizedUserPage from "../../pages/UnauthorizedUserPage";
import { ReactNode } from "react";
import CustomCenterSpinner from "../CustomCenterSpinner";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  console.log(" =======>>>> ", 'current user: ', currentUser, ' ; loading: ', isLoading);
  
  if (isLoading) {
    return <CustomCenterSpinner />;
  }
  
  if (!currentUser) {
    return <UnauthorizedUserPage />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
