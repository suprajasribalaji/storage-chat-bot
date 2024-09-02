import { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import UnauthorizedUserPage from "../../pages/UnauthorizedUserPage";
import CustomCenterSpinner from "../CustomCenterSpinner";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setInitialLoad(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (currentUser === null && !isLoading) {
      setInitialLoad(false);
    }
  }, [currentUser, isLoading]);

  if (isLoading || initialLoad) {
    return <CustomCenterSpinner />;
  }

  if (!currentUser && initialLoad) {
    return <UnauthorizedUserPage />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;