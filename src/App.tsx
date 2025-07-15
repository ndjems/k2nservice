import { Route, Routes, BrowserRouter } from "react-router-dom";
import ConnexionPage from "./pages/ConnexionPage";
import AccueilPage from "./pages/AccueilPage";
import { InscriptionPage } from "./pages/InscriptionPage";
import { ForgotPage } from "./pages/MotPasse";
import { OtpVerificationPage } from "./pages/VerificationPage";
import { ResetPasswordPage } from "./pages/ReinitialisePage";
import FondsPage from "./pages/FondsPage";
import AcquisitionsPage from "./pages/AcquisitionsPage";
import RapportPage from "./pages/RapportPage";
import EtatdefondsPage from "./pages/EtatdefondsPage";
import StockPage from "./pages/Stockpage";
import SortiePage from "./pages/SortiePage";
import DashboardPage from "./pages/DashboardPage";
import LogoutPage from "./pages/LogoutPage";
import VentesPage from "./pages/VentesPage";
import FormulairePage from "./pages/FormulairePage";
import TestAPI from "./pages/TestAPI";
import "./App.css"; // 
import MainLayout from "./layout/MainLayout";

// interface MainLayoutProps déplacée ou importée depuis layout/MainLayout.tsx si besoin

// MainLayout doit être importé depuis './layout/MainLayout' ou défini dans le fichier approprié
function App() {
  return (
    <div className="justify-between flex">
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<AccueilPage />} />
            <Route path="/connexion" element={<ConnexionPage />} />
            <Route path="/inscription" element={<InscriptionPage />} />
            <Route path="/passe" element={<ForgotPage />} />
            <Route path="/reinitialise" element={<OtpVerificationPage />} />
            <Route path="/verifie" element={<ResetPasswordPage />} />
            <Route path="/fonds" element={<FondsPage />} />
            <Route path="/acquisitions" element={<AcquisitionsPage />} />
            <Route path="/rapport" element={<RapportPage />} />
            <Route path="/etat-des-fonds" element={<EtatdefondsPage />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/sorties" element={<SortiePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/ventes" element={<VentesPage />} />
            <Route path="/formulaire" element={<FormulairePage />} />
            <Route path="/logout" element={<LogoutPage />} />
            
            <Route path="*" element={<h1>Page not found</h1>} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </div>
  );
}

export default App;
