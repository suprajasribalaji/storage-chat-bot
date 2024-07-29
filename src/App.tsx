import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ReactNode } from "react";
import AccessPage from "./pages/AccessPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { AuthProvider, useAuth } from "./components/context/Authentication";


const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/access" element={<AccessPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* <Route path="/" element={<ProtectedRoute><WareHousePage /></ProtectedRoute>} /> */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;