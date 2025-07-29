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
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const Rapports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rapports, setRapports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('mois');
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [error, setError] = useState(null);
  const [selectedRapport, setSelectedRapport] = useState(null);
  const [showRapportModal, setShowRapportModal] = useState(false);

  // États pour les statistiques avec montants
  const [stats, setStats] = useState({
    acquisitions: { count: 0, amount: 0 },
    sorties: { count: 0, amount: 0 },
    stocks: { count: 0, value: 0 },
    ventes: { count: 0, amount: 0 },
    fonds: { count: 0, amount: 0 }
  });

  useEffect(() => {
    fetchRapports();
    fetchStats();
  }, [selectedPeriod]);

  const fetchRapports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('http://localhost:9001/rapport/');
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setRapports(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les rapports');
      setRapports([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const dateDebut = getDateDebut();
      const dateFin = new Date().toISOString();
      
      // Récupération des statistiques avec montants
      const [acquisitionsRes, sortiesRes, stocksRes, ventesRes, fondsRes] = await Promise.all([
        fetch(`http://localhost:9001/stats/acquisitions?dateDebut=${dateDebut}&dateFin=${dateFin}`),
        fetch(`http://localhost:9001/stats/sorties?dateDebut=${dateDebut}&dateFin=${dateFin}`),
        fetch(`http://localhost:9001/stats/stocks`),
        fetch(`http://localhost:9001/stats/sales?dateDebut=${dateDebut}&dateFin=${dateFin}`),
        fetch(`http://localhost:9001/stats/fonds`)
      ]);

      const acquisitions = acquisitionsRes.ok ? await acquisitionsRes.json() : { count: 0, amount: 0 };
      const sorties = sortiesRes.ok ? await sortiesRes.json() : { count: 0, amount: 0 };
      const stocks = stocksRes.ok ? await stocksRes.json() : { count: 0, value: 0 };
      const ventes = ventesRes.ok ? await ventesRes.json() : { count: 0, amount: 0 };
      const fonds = fondsRes.ok ? await fondsRes.json() : { count: 0, amount: 0 };

      setStats({
        acquisitions: { 
          count: acquisitions.count || acquisitions.total || 0, 
          amount: acquisitions.amount || acquisitions.montant || 0 
        },
        sorties: { 
          count: sorties.count || sorties.total || 0, 
          amount: sorties.amount || sorties.montant || 0 
        },
        stocks: { 
          count: stocks.count || stocks.total || 0, 
          value: stocks.value || stocks.valeur || 0 
        },
        ventes: { 
          count: ventes.count || ventes.total || 0, 
          amount: ventes.amount || ventes.montant || 0 
        },
        fonds: { 
          count: 1, 
          amount: fonds.amount || fonds.solde || fonds.total || 0 
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  const generateRapport = async (type, category) => {
    try {
      setIsGenerating(true);
      setError(null);
      
      const requestBody = {
        type,
        category,
        period: selectedPeriod,
        dateDebut: getDateDebut(),
        dateFin: new Date().toISOString(),
        nom: `Rapport ${category} - ${selectedPeriod} - ${new Date().toLocaleDateString('fr-FR')}`
      };

      const response = await fetch('http://localhost:9001/rapport/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      const newRapport = await response.json();
      setRapports(prev => [newRapport, ...prev]);
      
      // Afficher une notification de succès (vous pouvez utiliser une bibliothèque de toast)
      console.log('Rapport généré avec succès:', newRapport);
      
    } catch (error) {
      console.error('Erreur:', error);
      setError(`Erreur lors de la génération du rapport: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const viewRapport = async (rapportId) => {
    try {
      const response = await fetch(`http://localhost:9001/rapport/${rapportId}/`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du rapport');
      }
      
      const rapportData = await response.json();
      setSelectedRapport(rapportData);
      setShowRapportModal(true);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible d\'afficher le rapport');
    }
  };

  const downloadRapport = async (rapportId, filename) => {
    try {
      const response = await fetch(`http://localhost:9001/rapport/${rapportId}/download/`);
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: Impossible de télécharger le rapport`);
      }
      
      // Vérifier le type de contenu
      const contentType = response.headers.get('content-type');
      const blob = await response.blob();
      
      // Déterminer l'extension du fichier
      let extension = '.txt';
      if (contentType?.includes('pdf')) extension = '.pdf';
      else if (contentType?.includes('excel') || contentType?.includes('spreadsheet')) extension = '.xlsx';
      else if (contentType?.includes('csv')) extension = '.csv';
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename.includes('.') ? filename : `${filename}${extension}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('Téléchargement terminé:', a.download);
    } catch (error) {
      console.error('Erreur:', error);
      setError(`Erreur lors du téléchargement: ${error.message}`);
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF'
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'terminé':
      case 'complete':
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'en cours':
      case 'processing':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'erreur':
      case 'error':
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'terminé':
      case 'complete':
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'en cours':
      case 'processing':
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'erreur':
      case 'error':
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
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
    const matchesSearch = rapport.nom?.toLowerCase().includes(searchQuery.toLowerCase());
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
            <input
              type="text"
              placeholder="Rechercher un rapport..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
            />
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

        {/* Messages d'erreur */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setError(null)}
                  className="ml-auto"
                >
                  Fermer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistiques globales avec montants */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Acquisitions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.acquisitions.count}</div>
              <p className="text-lg font-semibold text-blue-800">{formatCurrency(stats.acquisitions.amount)}</p>
              <p className="text-xs text-blue-600">Total période</p>
            </CardContent>
          </Card>
          
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Sorties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{stats.sorties.count}</div>
              <p className="text-lg font-semibold text-red-800">{formatCurrency(stats.sorties.amount)}</p>
              <p className="text-xs text-red-600">Total période</p>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Stocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{stats.stocks.count}</div>
              <p className="text-lg font-semibold text-purple-800">{formatCurrency(stats.stocks.value)}</p>
              <p className="text-xs text-purple-600">Valeur totale</p>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Ventes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{stats.ventes.count}</div>
              <p className="text-lg font-semibold text-green-800">{formatCurrency(stats.ventes.amount)}</p>
              <p className="text-xs text-green-600">Total période</p>
            </CardContent>
          </Card>
          
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800">Fonds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900">{formatCurrency(stats.fonds.amount)}</div>
              <p className="text-xs text-yellow-600">Trésorerie actuelle</p>
            </CardContent>
          </Card>
        </div>

        {/* Création de nouveaux rapports */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Créer un nouveau rapport</CardTitle>
            <CardDescription>
              Sélectionnez le type de rapport que vous souhaitez générer pour la période sélectionnée ({selectedPeriod})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {rapportTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Card key={type.id} className="cursor-pointer hover:shadow-md transition-shadow border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className={`w-12 h-12 bg-${type.color}-100 rounded-lg flex items-center justify-center`}>
                          <IconComponent className={`w-6 h-6 text-${type.color}-600`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{type.title}</h3>
                          <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => generateRapport(type.id, type.category)}
                          disabled={isGenerating}
                          className="w-full"
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
                <p className="text-gray-500">
                  {searchQuery || selectedCategory !== 'tous' 
                    ? 'Aucun rapport trouvé avec ces critères' 
                    : 'Aucun rapport trouvé'
                  }
                </p>
                <p className="text-sm text-gray-400">Créez votre premier rapport ci-dessus</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRapports.map((rapport) => (
                  <div key={rapport.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getStatusIcon(rapport.status)}
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
                            {new Date(rapport.dateCreation).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
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
                          {rapport.taille || 'N/A'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          disabled={rapport.status?.toLowerCase() !== 'terminé'}
                          onClick={() => viewRapport(rapport.id)}
                        >
                          <Eye className="w-4 h-4" />
                          Voir
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          disabled={rapport.status?.toLowerCase() !== 'terminé'}
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

        {/* Modal de visualisation du rapport */}
        {showRapportModal && selectedRapport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{selectedRapport.nom}</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowRapportModal(false)}
                  >
                    Fermer
                  </Button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Affichage du contenu du rapport */}
                <div className="prose max-w-none">
                  {selectedRapport.contenu ? (
                    <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                      {selectedRapport.contenu}
                    </pre>
                  ) : selectedRapport.data ? (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Données du rapport</h3>
                      <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm">
                        {JSON.stringify(selectedRapport.data, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-gray-500">Contenu du rapport non disponible</p>
                  )}
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                <Button 
                  variant="outline"
                  onClick={() => downloadRapport(selectedRapport.id, selectedRapport.nom)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Rapports;