import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
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
interface ForgotPasswordError {
  message: string;
  code?: string;
  field?: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
  resetToken?: string;
  expiresAt?: string;
}

export const ForgotPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ForgotPasswordError | null>(null);
  const [fieldError, setFieldError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    
    // Effacer les erreurs quand l'utilisateur tape
    if (fieldError) {
      setFieldError('');
    }
    if (error) {
      setError(null);
    }
  };

  const validateEmail = () => {
    if (!email) {
      setFieldError('L\'email est requis');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setFieldError('Format d\'email invalide');
      return false;
    }
    
    setFieldError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const response = await api.post<ForgotPasswordResponse>('/auth/forgot-password', {
        email: email,
      });

      const { data } = response;

      if (data.success) {
        setIsSubmitted(true);
        setSuccessMessage(
          data.message || 
          'Un lien de réinitialisation a été envoyé à votre adresse email'
        );
        
        // Log pour debug (à supprimer en production)
        console.log('Reset password request successful for:', email);
        
        // Optionnel : effacer l'email après succès pour la sécurité
        // setEmail('');
      } else {
        setError({
          message: data.message || 'Échec de l\'envoi du lien de réinitialisation',
          code: 'RESET_FAILED'
        });
      }

    } catch (err) {
      console.error('Erreur lors de la demande de réinitialisation:', err);
      
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // Erreurs du serveur (4xx, 5xx)
          const status = err.response.status;
          const errorData = err.response.data;
          
          switch (status) {
            case 400:
              setError({
                message: errorData.message || 'Email invalide',
                code: 'INVALID_EMAIL'
              });
              if (errorData.field === 'email') {
                setFieldError(errorData.message || 'Email invalide');
              }
              break;
              
            case 404:
              setError({
                message: 'Aucun compte trouvé avec cet email',
                code: 'USER_NOT_FOUND'
              });
              break;
              
            case 429:
              setError({
                message: 'Trop de demandes. Veuillez réessayer dans quelques minutes',
                code: 'TOO_MANY_REQUESTS'
              });
              break;
              
            case 403:
              setError({
                message: 'Compte suspendu. Contactez le support',
                code: 'ACCOUNT_SUSPENDED'
              });
              break;
              
            case 422:
              setError({
                message: 'Un lien de réinitialisation a déjà été envoyé. Vérifiez votre email',
                code: 'RESET_ALREADY_SENT'
              });
              break;
              
            case 500:
              setError({
                message: 'Erreur serveur. Veuillez réessayer plus tard',
                code: 'SERVER_ERROR'
              });
              break;
              
            case 503:
              setError({
                message: 'Service d\'email temporairement indisponible',
                code: 'EMAIL_SERVICE_UNAVAILABLE'
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

  const handleRetry = () => {
    setIsSubmitted(false);
    setError(null);
    setSuccessMessage('');
    setEmail('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link 
            to="/connexion" 
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Retour à la connexion</span>
          </Link>
                   
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Mot de passe oublié
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Entrez votre email pour recevoir un lien de réinitialisation
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

        {!isSubmitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                    fieldError ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="votre@email.com"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isLoading}
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {fieldError && (
                <p className="mt-1 text-sm text-red-600">{fieldError}</p>
              )}
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
                    Envoi en cours...
                  </div>
                ) : (
                  'Envoyer le lien de réinitialisation'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Email envoyé !
              </h3>
              <p className="text-green-700 mb-4">
                {successMessage || (
                  <>
                    Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>.
                    Vérifiez votre boîte de réception et suivez les instructions.
                  </>
                )}
              </p>
              <div className="text-sm text-green-600 bg-green-100 rounded-md p-3 mb-4">
                <p className="font-medium mb-1">Important :</p>
                <ul className="text-left space-y-1">
                  <li>• Vérifiez aussi vos spams</li>
                  <li>• Le lien expire dans 30 minutes</li>
                  <li>• Vous ne recevrez qu'un seul email</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link
                to="/connexion"
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                Retour à la connexion
              </Link>
              <button
                onClick={handleRetry}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Nouvel email
              </button>
            </div>
          </div>
        )}

        {/* Aide supplémentaire */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Vous rencontrez des difficultés ?{' '}
            <Link 
              to="/contact" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Contactez le support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};