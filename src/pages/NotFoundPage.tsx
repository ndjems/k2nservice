import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
    <p className="text-lg text-gray-700 mb-6">Oups ! Cette page n'existe pas.</p>
    <Link to="/" className="text-blue-600 hover:underline">
      Retour à l'accueil
    </Link>
  </div>
);

export default NotFoundPage;