import { BrowserRouter, Route, Routes } from "react-router-dom";
import AccessPage from "./pages/AccessPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./components/route/ProtectedRoute";
import { Provider } from "react-redux";
import store from "./redux/store";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./redux/slices/auth/AuthProvider";
import PageNotExistPage from "./pages/PageNotExistPage";
import OTPVerificationPage from "./pages/OTPVerificationPage";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AccessPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-user" element={<OTPVerificationPage />} />
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <HomePage/>
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<PageNotExistPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}

export default App;
