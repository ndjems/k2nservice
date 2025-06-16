import { Route, Routes } from "react-router";
import ConnexionPage from "./pages/ConnexionPage";
import HomePage from "./pages/HomePage";
import { BrowserRouter, } from "react-router-dom";
import FormPage from "./pages/FormPage";
import { InscriptionPage } from "./pages/InscriptionPage";
import { ForgotPage } from "./pages/MotPasse";
import { OtpVerificationPage } from "./pages/VerificationPage";
import { ResetPasswordPage } from "./pages/ReinitialisePage";
import  VentesPage  from "./pages/VentesPage";
import FondsPage from "./pages/FondsPage";
import AcquisitionsPage from "./pages/AcquisitionsPage";
import RapportPage from "./pages/RapportPage";

export default function App() {
  return (
    <div className="justify-between flex  ">
   <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/connexion" element={<ConnexionPage />} />
          <Route path="/form" element={<FormPage/>}/>
          <Route path="*" element={<h1>Page not found</h1>} />
           <Route path="/inscription" element={<InscriptionPage />} />
          <Route path="/passe" element={<ForgotPage />} />  
          <Route path="/reinitialise" element={<OtpVerificationPage/>}  />
          <Route path="/verifie" element={<ResetPasswordPage />} />
          <Route path="/ventes" element={<VentesPage />} />
          <Route path="/fonds" element={<FondsPage />} />
          <Route path="/acquisitions" element={<AcquisitionsPage />} />
          <Route path="/rapport" element={<RapportPage />} />
        </Routes>
   </BrowserRouter>
    </div>
  )
}