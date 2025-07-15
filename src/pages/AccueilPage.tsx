import React from 'react';
import { Link } from 'react-router-dom';

function AccueilPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-purple-100">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-xl w-full">
        <h1 className="text-4xl font-bold text-purple-700 mb-4">Bienvenue sur K2N Service !</h1>
        <p className="text-lg text-gray-700 mb-8">
          Gérez vos stocks, ventes, acquisitions et finances facilement depuis une seule plateforme.<br/>
          Naviguez dans le menu pour accéder aux différentes fonctionnalités.
        </p>
        <div className="flex flex-col gap-4">
          <Link to="/connexion" className="bg-purple-500 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded transition">Se connecter</Link>
          <Link to="/inscription" className="bg-pink-400 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded transition">Créer un compte</Link>
          <Link to="/dashboard" className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-6 rounded transition">Accéder au tableau de bord</Link>
        </div>
      </div>
      <footer className="mt-10 text-gray-400">&copy; {new Date().getFullYear()} K2N Service</footer>
    </main>
  );
}

export default AccueilPage;
