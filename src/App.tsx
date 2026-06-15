import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

const queryClient = new QueryClient();

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
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path="/" element={<LandingPage />} />
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
  </QueryClientProvider>
);

export default App;
