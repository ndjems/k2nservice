import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import Layout from "./composants/Layout/Layout";
import HomePage from "./pages/HomePage";
import ConnexionPage from "./pages/ConnexionPage";
import FormPage from "./pages/FormPage";
import { InscriptionPage } from "./pages/InscriptionPage";
import { ForgotPage } from "./pages/MotPasse";
import { OtpVerificationPage } from "./pages/VerificationPage";
import { ResetPasswordPage } from "./pages/ReinitialisePage";
import VentesPage from "./pages/VentesPage";
import FondsPage from "./pages/FondsPage";
import AcquisitionsPage from "./pages/AcquisitionsPage";
import RapportPage from "./pages/RapportPage";
import EtatdefondsPage from "./pages/EtatdefondsPage";
import StockPage from "./pages/Stockpage";
import SortiePage from "./pages/SortiePage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/connexion" element={<ConnexionPage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/inscription" element={<InscriptionPage />} />
          <Route path="/passe" element={<ForgotPage />} />
          <Route path="/reinitialise" element={<OtpVerificationPage />} />
          <Route path="/verifie" element={<ResetPasswordPage />} />
          <Route path="/ventes" element={<VentesPage />} />
          <Route path="/fonds" element={<FondsPage />} />
          <Route path="/acquisitions" element={<AcquisitionsPage />} />
          <Route path="/rapport" element={<RapportPage />} />
          <Route path="/etat-des-fonds" element={<EtatdefondsPage />} />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/sorties" element={<SortiePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}