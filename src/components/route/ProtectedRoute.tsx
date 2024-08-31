import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Spin } from "antd";
import UnauthorizedUserPage from "../../pages/UnauthorizedUserPage";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  console.log(" =======>>>> ", 'current user: ', currentUser, ' ; loading: ', isLoading);
  
  if (isLoading) return <div><Spin spinning = {isLoading}/></div>;
  
  if(!currentUser) return <UnauthorizedUserPage />;
  
  return children;
};

export default ProtectedRoute;