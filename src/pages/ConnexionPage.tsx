import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import axios from 'axios';

// Configuration d'axios
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Ajustez selon votre API
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types pour les erreurs et réponses
interface LoginError {
  message: string;
  code?: string;
  field?: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  message?: string;
}

const ConnexionPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<LoginError | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Effacer les erreurs quand l'utilisateur tape
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (error) {
      setError(null);
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.email) {
      errors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Format d\'email invalide';
    }
    
    if (!formData.password) {
      errors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        email: formData.email,
        password: formData.password,
        rememberMe: rememberMe,
      });

      const { data } = response;

      if (data.success && data.token) {
        // Stocker le token dans le localStorage ou sessionStorage selon rememberMe
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('authToken', data.token);
        
        // Stocker les infos utilisateur
        if (data.user) {
          storage.setItem('user', JSON.stringify(data.user));
        }

        // Configurer le header d'autorisation pour les prochaines requêtes
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

        // Rediriger vers le dashboard ou la page d'accueil
        navigate('/dashboard', { replace: true });
      } else {
        setError({
          message: data.message || 'Échec de la connexion',
          code: 'LOGIN_FAILED'
        });
      }

    } catch (err) {
      console.error('Erreur de connexion:', err);
      
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // Erreurs du serveur (4xx, 5xx)
          const status = err.response.status;
          const errorData = err.response.data;
          
          switch (status) {
            case 400:
              setError({
                message: errorData.message || 'Données invalides',
                code: 'INVALID_DATA'
              });
              // Gérer les erreurs de validation spécifiques aux champs
              if (errorData.errors) {
                setFieldErrors(errorData.errors);
              }
              break;
              
            case 401:
              setError({
                message: 'Email ou mot de passe incorrect',
                code: 'INVALID_CREDENTIALS'
              });
              break;
              
            case 403:
              setError({
                message: 'Compte suspendu ou accès refusé',
                code: 'ACCOUNT_SUSPENDED'
              });
              break;
              
            case 404:
              setError({
                message: 'Aucun compte trouvé avec cet email',
                code: 'USER_NOT_FOUND'
              });
              break;
              
            case 429:
              setError({
                message: 'Trop de tentatives. Veuillez réessayer plus tard',
                code: 'TOO_MANY_REQUESTS'
              });
              break;
              
            case 423:
              setError({
                message: 'Compte verrouillé. Contactez le support',
                code: 'ACCOUNT_LOCKED'
              });
              break;
              
            case 500:
              setError({
                message: 'Erreur serveur. Veuillez réessayer plus tard',
                code: 'SERVER_ERROR'
              });
              break;
              
            case 502:
            case 503:
            case 504:
              setError({
                message: 'Service temporairement indisponible',
                code: 'SERVICE_UNAVAILABLE'
              });
              break;
              
            default:
              setError({
                message: errorData.message || 'Une erreur inattendue s\'est produite',
                code: 'UNKNOWN_ERROR'
              });
          }
        } else if (err.request) {
          // Erreur réseau
          setError({
            message: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet',
            code: 'NETWORK_ERROR'
          });
        } else {
          // Erreur dans la configuration de la requête
          setError({
            message: 'Erreur de configuration. Veuillez réessayer',
            code: 'CONFIG_ERROR'
          });
        }
      } else {
        // Erreur non-axios
        setError({
          message: 'Une erreur inattendue s\'est produite',
          code: 'UNEXPECTED_ERROR'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion à votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link to="/inscription" className="font-medium text-blue-600 hover:text-blue-500">
              créez un nouveau compte
            </Link>
          </p>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-red-800 font-medium">
                {error.message}
              </p>
              {error.code && (
                <p className="text-xs text-red-600 mt-1">
                  Code: {error.code}
                </p>
              )}
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`appearance-none relative block w-full px-3 py-2 pl-10 border ${
                    fieldErrors.email ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className={`appearance-none relative block w-full px-3 py-2 pl-10 pr-10 border ${
                    fieldErrors.password ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <Link to="/passe" className="font-medium text-blue-600 hover:text-blue-500">
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConnexionPage;