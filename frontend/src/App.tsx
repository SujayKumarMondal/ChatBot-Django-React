import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignIn";
import OAuthCallback from "./pages/OAuthCallback";
import { AboutPage } from "./pages/AboutPage";
import { AboutMePage } from "./pages/AboutMePage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import TermsPage from "./pages/TermsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import SettingsPage from "./pages/SettingsPage";

const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Auth routes */}
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/oauth-callback" element={<OAuthCallback />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/about-me" element={<AboutMePage />} />
              {/* Settings route */}
              <Route path="/settings" element={<SettingsPage />} />
              {/* App layout */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="chats/:chat_uid" element={<HomePage />} />
                <Route path="chats/new" element={<HomePage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
