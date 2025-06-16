import  { useState } from 'react';
import { Link } from 'react-router-dom';

const ConnexionPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/npm start/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Connexion réussie — à adapter selon ton système d'authentification
        console.log('Connexion réussie :', data);
        localStorage.setItem('token', data.token); // si tu reçois un JWT
        window.location.href = '/dashboard'; // ou toute autre page
      } else {
        setErrorMessage(data.detail || 'Identifiants incorrects.');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      setErrorMessage('Erreur réseau. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen  w-full flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-6">
          <img
            src="../assets/k2n_Group0_Profile.png"
            alt="Logo de l'application"
            className="mx-auto w-24 h-24 mb-4"
          />
          <h1 className="text-2xl font-bold">Bienvenue</h1>
          <p className="text-gray-500">Connectez-vous pour continuer</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center border rounded-md px-3 py-2 shadow-sm">
            <i className="fas fa-user text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              className="flex-1 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 flex items-center border rounded-md px-3 py-2 shadow-sm">
            <i className="fas fa-lock text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Mot de passe"
              className="flex-1 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Link to="/"><button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Se connecter
          </button></Link>

          <div className="flex flex-col items-center mt-4 text-sm text-gray-600">
            <a href="/passe" className="text-blue-500 hover:underline">Mot de passe oublié ?</a>
            <span>
              Nouveau ici ? <a href="/inscription" className="text-blue-500 hover:underline">Créer un compte</a>
            </span>
          </div>

          {errorMessage && (
            <p className="text-red-600 text-center mt-3">{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ConnexionPage;
