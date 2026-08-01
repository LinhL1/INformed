import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import ModulesPage from "./pages/ModulesPage";
import ModulePage from "./pages/ModulePage";
import LessonPage from "./pages/LessonPage";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import ProfilePage from "./pages/ProfilePage";
import OnboardingPage from "./pages/OnboardingPage";

function AppShell() {
  const location = useLocation();
  return (
    <>
      <Header />
      <AnimatePresence mode="wait">
        <div key={location.pathname}>
          <Outlet />
        </div>
      </AnimatePresence>
    </>
  );
}

const App = () => (
  <TooltipProvider>
    <Toaster />
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          {/* Public routes — landing page is accessible without auth */}
          <Route element={<AppShell />}>
            <Route path="/" element={<LandingPage />} />
          </Route>
          {/* Protected routes — redirect to /signin if not authenticated */}
          <Route element={<ProtectedRoute />}>
            {/* Full-screen, chromeless (no Header) — like /signin but auth-required */}
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route element={<AppShell />}>
              <Route path="/modules" element={<ModulesPage />} />
              <Route path="/module/:moduleId" element={<ModulePage />} />
              <Route path="/module/:moduleId/lesson/:lessonId" element={<LessonPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
