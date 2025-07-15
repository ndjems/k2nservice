import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Nettoyage des infos utilisateur
    [
      'access_token',
      'refresh_token',
      'email',
      'role',
      'denomination_magasin',
      'token',
    ].forEach((item) => {
      localStorage.removeItem(item);
    });
    // Redirection après déconnexion
    navigate('/connexion', { replace: true });
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <span className="text-lg text-gray-700">Déconnexion en cours...</span>
    </div>
  );
};

export default LogoutPage;
