import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Acquisitions from "./pages/Acquisitions";
import Ventes from "./pages/Ventes";
import Fonds from "./pages/Fonds";
import EtatFonds from "./pages/EtatFonds";
import Rapports from "./pages/Rapports";
import Enregistrement from "./pages/Enregistrement";
import Stocks from "./pages/Stocks";
import Sorties from "./pages/Sorties";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div>Chargement...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          // Ajout des flags futurs pour React Router v7
          future={{
            v7_startTransition: true,       // Activer React.startTransition
            v7_relativeSplatPath: true,     // Activer la résolution des chemins relatifs pour les Splat
          }}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/acquisitions" element={<ProtectedRoute><Acquisitions /></ProtectedRoute>} />
            <Route path="/dashboard/ventes" element={<ProtectedRoute><Ventes /></ProtectedRoute>} />
            <Route path="/dashboard/fonds" element={<ProtectedRoute><Fonds /></ProtectedRoute>} />
            <Route path="/dashboard/etat-fonds" element={<ProtectedRoute><EtatFonds /></ProtectedRoute>} />
            <Route path="/dashboard/rapports" element={<ProtectedRoute><Rapports /></ProtectedRoute>} />
            <Route path="/dashboard/enregistrement" element={<ProtectedRoute><Enregistrement /></ProtectedRoute>} />
            <Route path="/dashboard/stocks" element={<ProtectedRoute><Stocks /></ProtectedRoute>} />
            <Route path="/dashboard/sorties" element={<ProtectedRoute><Sorties /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
