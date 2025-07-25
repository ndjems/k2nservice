import { DashboardHeader } from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  Wallet,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:9001/api/dashboard/stats');
        setStats(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Couleur principale
  const primaryColor = '#095228';
  const successColor = '#2e7d32';
  const errorColor = '#d32f2f';

  const statCards = stats ? [
    {
      title: 'Ventes totales',
      value: `${stats.ventes.total.toLocaleString()} €`,
      change: `${stats.ventes.change}%`,
      trend: stats.ventes.change >= 0 ? 'up' : 'down',
      icon: TrendingUp,
      color: primaryColor,
    },
    {
      title: 'Acquisitions',
      value: stats.acquisitions.total.toLocaleString(),
      change: `${stats.acquisitions.change}%`,
      trend: stats.acquisitions.change >= 0 ? 'up' : 'down',
      icon: ShoppingCart,
      color: primaryColor,
    },
    {
      title: 'Fonds disponibles',
      value: `${stats.fonds.total.toLocaleString()} €`,
      change: `${stats.fonds.change}%`,
      trend: stats.fonds.change >= 0 ? 'up' : 'down',
      icon: Wallet,
      color: primaryColor,
    },
    {
      title: 'Stocks',
      value: stats.stocks.total.toString(),
      change: `${stats.stocks.change}%`,
      trend: stats.stocks.change >= 0 ? 'up' : 'down',
      icon: Package,
      color: primaryColor,
    },
  ] : [];

  const recentActivities = stats?.activites || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="p-6">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: primaryColor }}>
            Tableau de bord K2NService
          </h1>
          <p className="text-gray-600">
            Vue d'ensemble de votre activité
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <p>Chargement des données...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">
                  {stat.title}
                </CardTitle>
                <div className="p-2 rounded-full" style={{ backgroundColor: `${primaryColor}20` }}>
                  <stat.icon className="w-4 h-4" style={{ color: primaryColor }} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2" style={{ color: primaryColor }}>
                  {stat.value}
                </div>
                <div className="flex items-center text-sm">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" style={{ color: successColor }} />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" style={{ color: errorColor }} />
                  )}
                  <span className="ml-1 text-gray-600">
                    {stat.change} vs mois dernier
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Actions rapides */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" style={{ color: primaryColor }} />
                  <span style={{ color: primaryColor }}>Actions rapides</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Nouvelle vente', icon: TrendingUp },
                    { name: 'Acquisition', icon: ShoppingCart },
                    { name: 'Gérer fonds', icon: Wallet },
                    { name: 'Stocks', icon: Package },
                    { name: 'Rapports', icon: FileText },
                    { name: 'Clients', icon: Users },
                  ].map((action, index) => (
                    <Button
                      key={index}
                      className="flex flex-col h-20 gap-2 hover:bg-green-50"
                      style={{ borderColor: primaryColor }}
                    >
                      <action.icon className="w-5 h-5" style={{ color: primaryColor }} />
                      <span className="text-xs">{action.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activités récentes */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle style={{ color: primaryColor }}>Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div className="p-2 rounded-full mr-3" style={{ backgroundColor: `${primaryColor}20` }}>
                        {activity.type === 'vente' ? (
                          <TrendingUp className="w-4 h-4" style={{ color: primaryColor }} />
                        ) : (
                          <ShoppingCart className="w-4 h-4" style={{ color: primaryColor }} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium" style={{ color: primaryColor }}>
                          {activity.description}
                        </p>
                        <p className="text-sm text-gray-600">{activity.time}</p>
                      </div>
                      <Badge 
                        className="ml-2" 
                        style={{ 
                          backgroundColor: activity.status === 'completed' ? primaryColor : `${primaryColor}20`,
                          color: activity.status === 'completed' ? 'white' : primaryColor
                        }}
                      >
                        {activity.status === 'completed' ? 'Terminé' : 'En cours'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section graphique */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: primaryColor }}>
              <BarChart3 className="w-5 h-5" />
              Performances des 30 derniers jours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-lg flex items-center justify-center" 
                 style={{ backgroundColor: `${primaryColor}10` }}>
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4" style={{ color: primaryColor }} />
                <p className="mb-2" style={{ color: primaryColor }}>Graphique des performances</p>
                <p className="text-sm text-gray-600">
                  Visualisation des données de ventes et acquisitions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
