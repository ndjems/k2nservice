import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import axios from 'axios';

// === Axios instance locale ===
const axiosInstance = axios.create({
  baseURL: 'http://localhost:9001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// === Interfaces ===
interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// === Création du contexte ===
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// === Composant AuthProvider ===
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // === Chargement initial depuis localStorage ===
  useEffect(() => {
    const storedToken = localStorage.getItem('k2n_token');
    const storedUser = localStorage.getItem('k2n_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  // === Fonction login avec axios ===
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    console.log('🔐 Tentative de connexion pour:', email);

    try {
      // Vérifier si le serveur est joignable
      console.log('🧪 Test de connexion au serveur...');
      console.log('✅ Serveur accessible, tentative de login...');

      // Requête de connexion
      const response = await axiosInstance.post('/login', {
        email,
        password,
      });

      console.log('📡 Réponse reçue:', response.status, response.statusText);

      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem('k2n_token', receivedToken);
      localStorage.setItem('k2n_user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);

      console.log('✅ Connexion réussie pour:', email);
    } catch (error: any) {
      console.error('❌ Erreur lors de la connexion:', error);

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.detail?.message ||
          error.response?.data?.message ||
          'Erreur de connexion';
        throw new Error(message);
      } else {
        throw new Error(error.message || 'Erreur de connexion');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // === Fonction logout ===
  const logout = () => {
    localStorage.removeItem('k2n_token');
    localStorage.removeItem('k2n_user');
    setToken(null);
    setUser(null);
    console.log('👋 Déconnexion effectuée');
  };

  // === Valeur du contexte ===
  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// === Hook personnalisé useAuth ===
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
