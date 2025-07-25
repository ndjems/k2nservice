import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  BarChart3, 
  TrendingUp, 
  FileBarChart,
  ShoppingCart,
  Package,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Warehouse,
  Plus,
  Eye,
  Loader2
} from 'lucide-react';

const Rapports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rapports, setRapports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('mois');
  const [selectedCategory, setSelectedCategory] = useState('tous');

  // États pour les statistiques
  const [stats, setStats] = useState({
    acquisitions: 0,
    sorties: 0,
    stocks: 0,
    ventes: 0,
    fonds: 0
  });

  useEffect(() => {
    fetchRapports();
    fetchStats();
  }, []);

  const fetchRapports = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:9001/api/sales/rapport/');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des rapports');
      }
      const data = await response.json();
      setRapports(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Récupération des statistiques depuis différentes APIs
      const [acquisitionsRes, sortiesRes, stocksRes, ventesRes, fondsRes] = await Promise.all([
        fetch('http://localhost:9001/acquisitions/stats/'),
        fetch('http://localhost:9001/sorties/stats/'),
        fetch('http://localhost:9001/stocks/stats/'),
        fetch('http://localhost:9001/sales/stats/'),
        fetch('http://localhost:9001/fonds/stats/')
      ]);

      const acquisitions = await acquisitionsRes.json();
      const sorties = await sortiesRes.json();
      const stocks = await stocksRes.json();
      const ventes = await ventesRes.json();
      const fonds = await fondsRes.json();

      setStats({
        acquisitions: acquisitions.total || 0,
        sorties: sorties.total || 0,
        stocks: stocks.total || 0,
        ventes: ventes.total || 0,
        fonds: fonds.total || 0
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  const generateRapport = async (type, category) => {
    try {
      setIsGenerating(true);
      const response = await fetch('http://localhost:9001/rapport/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          category,
          period: selectedPeriod,
          dateDebut: getDateDebut(),
          dateFin: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du rapport');
      }

      const newRapport = await response.json();
      setRapports(prev => [newRapport, ...prev]);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadRapport = async (rapportId, filename) => {
    try {
      const response = await fetch(`http://localhost:9001/rapport/${rapportId}/download/`);
      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const getDateDebut = () => {
    const now = new Date();
    switch (selectedPeriod) {
      case 'semaine':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return weekAgo.toISOString();
      case 'mois':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return monthAgo.toISOString();
      case 'trimestre':
        const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        return quarterAgo.toISOString();
      case 'annee':
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        return yearAgo.toISOString();
      default:
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Terminé':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'En cours':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Erreur':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategorieColor = (categorie) => {
    switch (categorie) {
      case 'Acquisitions':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Sorties':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Stocks':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Ventes':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Fonds':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const rapportTypes = [
    {
      id: 'acquisitions',
      title: 'Rapport Acquisitions',
      description: 'Détail des acquisitions par période',
      icon: ArrowDownRight,
      category: 'Acquisitions',
      color: 'blue'
    },
    {
      id: 'sorties',
      title: 'Rapport Sorties',
      description: 'Analyse des sorties de stock',
      icon: ArrowUpRight,
      category: 'Sorties',
      color: 'red'
    },
    {
      id: 'stocks',
      title: 'Rapport Stocks',
      description: 'État des stocks et inventaire',
      icon: Warehouse,
      category: 'Stocks',
      color: 'purple'
    },
    {
      id: 'ventes',
      title: 'Rapport Ventes',
      description: 'Performance des ventes',
      icon: ShoppingCart,
      category: 'Ventes',
      color: 'green'
    },
    {
      id: 'fonds',
      title: 'Rapport Fonds',
      description: 'Suivi des fonds et trésorerie',
      icon: DollarSign,
      category: 'Fonds',
      color: 'yellow'
    }
  ];

  const filteredRapports = rapports.filter(rapport => {
    const matchesSearch = rapport.nom.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'tous' || rapport.categorie === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-8 h-8" />
              Rapports
            </h1>
            <p className="text-gray-600">
              Génération et gestion des rapports d'activité
            </p>
          </div>
          <div className="flex gap-2">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="tous">Toutes catégories</option>
              <option value="Acquisitions">Acquisitions</option>
              <option value="Sorties">Sorties</option>
              <option value="Stocks">Stocks</option>
              <option value="Ventes">Ventes</option>
              <option value="Fonds">Fonds</option>
            </select>
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="semaine">Cette semaine</option>
              <option value="mois">Ce mois</option>
              <option value="trimestre">Ce trimestre</option>
              <option value="annee">Cette année</option>
            </select>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Acquisitions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.acquisitions}</div>
              <p className="text-xs text-blue-600">Total période</p>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Sorties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{stats.sorties}</div>
              <p className="text-xs text-red-600">Total période</p>
            </CardContent>
          </Card>
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Stocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{stats.stocks}</div>
              <p className="text-xs text-purple-600">Articles en stock</p>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Ventes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{stats.ventes}</div>
              <p className="text-xs text-green-600">Total période</p>
            </CardContent>
          </Card>
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800">Fonds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900">{stats.fonds} €</div>
              <p className="text-xs text-yellow-600">Trésorerie</p>
            </CardContent>
          </Card>
        </div>

        {/* Création de nouveaux rapports */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Créer un nouveau rapport</CardTitle>
            <CardDescription>
              Sélectionnez le type de rapport que vous souhaitez générer pour la période sélectionnée
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {rapportTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Card key={type.id} className={`cursor-pointer hover:shadow-md transition-shadow border-${type.color}-200 bg-${type.color}-50`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className={`w-12 h-12 bg-${type.color}-100 rounded-lg flex items-center justify-center`}>
                          <IconComponent className={`w-6 h-6 text-${type.color}-600`} />
                        </div>
                        <div>
                          <h3 className={`font-medium text-${type.color}-900`}>{type.title}</h3>
                          <p className={`text-xs text-${type.color}-600 mt-1`}>{type.description}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => generateRapport(type.id, type.category)}
                          disabled={isGenerating}
                          className={`w-full bg-${type.color}-600 hover:bg-${type.color}-700`}
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Génération...
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Générer
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Liste des rapports */}
        <Card>
          <CardHeader>
            <CardTitle>Rapports générés</CardTitle>
            <CardDescription>
              Historique des rapports générés ({filteredRapports.length} rapports)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Chargement des données...</p>
              </div>
            ) : filteredRapports.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Aucun rapport trouvé</p>
                <p className="text-sm text-gray-400">Créez votre premier rapport ci-dessus</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRapports.map((rapport) => (
                  <div key={rapport.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{rapport.nom}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getCategorieColor(rapport.categorie)}>
                            {rapport.categorie}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {rapport.type}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {new Date(rapport.dateCreation).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge className={getStatusColor(rapport.status)}>
                          {rapport.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {rapport.taille}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          disabled={rapport.status !== 'Terminé'}
                        >
                          <Eye className="w-4 h-4" />
                          Voir
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          disabled={rapport.status !== 'Terminé'}
                          onClick={() => downloadRapport(rapport.id, rapport.nom)}
                        >
                          <Download className="w-4 h-4" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Rapports;