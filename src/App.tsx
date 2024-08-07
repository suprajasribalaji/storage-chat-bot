import { BrowserRouter, Route, Routes } from "react-router-dom";
import AccessPage from "./pages/AccessPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { Provider } from "react-redux";
import store from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/access" element={<AccessPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <AccessPage/> {/* Add home component */}
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
