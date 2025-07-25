import React, { FormEvent, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth(); // ✅ On utilise le contexte ici
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await login(email, password); // ✅ Appelle login du contexte
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans K2NService",
      });
       navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Identifiants invalides",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-[4rem] h-[4rem] bg-gradient-primary rounded-xl flex items-center justify-center">
              <img src="../public/fish.jpg" alt="logo" className="w-[4rem] h-[4rem]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#095228]">K2NService</h1>
              <p className="text-sm text-muted-foreground">Plateforme de gestion</p>
            </div>
          </div>
        </div>

        {/* Formulaire de connexion */}
        <Card className="shadow-k2n-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Connexion</CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Accédez à votre espace de gestion
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-green-700 hover:bg-green-900"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            {/* Infos sécurité */}
            <div className="mt-6 p-3 bg-green-300 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#095228]" />
                <span className="text-sm text-green-800 font-medium">
                  Connexion sécurisée
                </span>
              </div>
              <p className="text-xs text-green-800 mt-1">
                Vos données sont protégées par un chiffrement SSL
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>© 2025 K2NService. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
