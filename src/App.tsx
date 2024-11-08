import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { AuthProvider } from "./redux/slices/auth/AuthProvider";

const AccessPage = lazy(() => import("./pages/AccessPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const PageNotExistPage = lazy(() => import("./pages/PageNotExistPage"));
const OTPVerificationPage = lazy(() => import("./pages/OTPVerificationPage"));
const ProtectedRoute = lazy(() => import("./components/route/ProtectedRoute"));

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
      ),
    },
    { path: "*", element: <PageNotExistPage /> },
  ];

  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}

export default App;
