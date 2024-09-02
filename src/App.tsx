import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { AuthProvider } from "./redux/slices/auth/AuthProvider";

import AccessPage from "./pages/AccessPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import PageNotExistPage from "./pages/PageNotExistPage";
import OTPVerificationPage from "./pages/OTPVerificationPage";

import ProtectedRoute from "./components/route/ProtectedRoute";

function App() {
  const routes = [
    { path: "/", element: <AccessPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignupPage /> },
    { path: "/verify-user", element: <OTPVerificationPage /> },
    { 
      path: "/home", 
      element: (
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      ) 
    },
    { path: "*", element: <PageNotExistPage /> }
  ];

  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}

export default App;
