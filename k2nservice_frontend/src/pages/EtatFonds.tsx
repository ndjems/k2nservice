import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Calendar, 
  Download,
  ChevronDown
} from 'lucide-react';

const EtatFonds = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('Ce mois');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  const periods = [
    'Cette semaine',
    'Ce mois',
    'Ce trimestre',
    'Cette année',
    'Personnalisé'
  ];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('http://localhost:9001/etat_fonds');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedPeriod]); // Refetch data when period changes

  // Fonction pour exporter les données
  const handleExport = () => {
    if (!analytics) return;

    // Créer les données à exporter
    const exportData = {
      periode: selectedPeriod,
      dateExport: new Date().toISOString(),
      resume: {
        totalFonds: analytics.totalFonds,
        objectif: analytics.objectif,
        variation: analytics.variation,
        progressObjectif: (analytics.totalFonds / analytics.objectif) * 100
      },
      repartition: analytics.repartition,
      mouvements: analytics.mouvements
    };

    // Convertir en JSON
    const jsonData = JSON.stringify(exportData, null, 2);
    
    // Créer un blob et télécharger
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `etat_fonds_${selectedPeriod.toLowerCase().replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Alternative: Export CSV
    // handleExportCSV();
  };

  // Fonction alternative pour exporter en CSV
  const handleExportCSV = () => {
    if (!analytics) return;

    let csvContent = "Type,Description,Date,Montant,Pourcentage\n";
    
    // Ajouter les mouvements
    analytics.mouvements.forEach(mouvement => {
      csvContent += `${mouvement.type},"${mouvement.description}",${mouvement.date},${mouvement.montant},\n`;
    });

    // Ajouter la répartition
    analytics.repartition.forEach(item => {
      csvContent += `Répartition,"${item.type}",,${item.montant},${item.pourcentage}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `etat_fonds_${selectedPeriod.toLowerCase().replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Fonction pour changer la période
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    setShowPeriodDropdown(false);
    // Ici vous pourriez refaire l'appel API avec la nouvelle période
    // par exemple: fetchAnalytics(period);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <div className="text-green-900 font-medium">Chargement des données...</div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-background-secondary flex items-center justify-center">
        <div className="text-center text-green-900">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <div className="font-medium">Aucune donnée disponible.</div>
        </div>
      </div>
    );
  }

  const progressObjectif = (analytics.totalFonds / analytics.objectif) * 100;

  return (
    <div className="min-h-screen bg-background-secondary">
      <DashboardHeader onSearch={setSearchQuery} />
      
      <main className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-900 flex items-center gap-2">
              <BarChart3 className="w-8 h-8" />
              État des fonds
            </h1>
            <p className="text-muted-foreground">
              Analyse et suivi des performances financières • {selectedPeriod}
            </p>
          </div>
          <div className="flex gap-2">
            {/* Bouton Période avec dropdown */}
            <div className="relative">
              <Button 
                variant="outline" 
                className="gap-2 bg-green-700 hover:bg-green-800 text-white border-green-700 hover:border-green-800"
                onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              >
                <Calendar className="w-4 h-4" />
                {selectedPeriod}
                <ChevronDown className="w-4 h-4" />
              </Button>
              
              {showPeriodDropdown && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[180px]">
                  {periods.map((period) => (
                    <button
                      key={period}
                      className={`w-full text-left px-4 py-2 hover:bg-green-50 transition-colors ${
                        selectedPeriod === period ? 'bg-green-100 text-green-900 font-medium' : 'text-gray-700'
                      }`}
                      onClick={() => handlePeriodChange(period)}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bouton Export avec menu déroulant */}
            <div className="relative group">
              <Button 
                className="gap-2 bg-green-700 hover:bg-green-800 text-white"
                onClick={handleExport}
              >
                <Download className="w-4 h-4" />
                Exporter
              </Button>
              
              {/* Menu déroulant pour les options d'export */}
              <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[150px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-green-50 text-gray-700 transition-colors"
                  onClick={handleExport}
                >
                  Export JSON
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-green-50 text-gray-700 transition-colors"
                  onClick={handleExportCSV}
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total des fonds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{analytics.totalFonds.toLocaleString()} XAF</div>
              <div className="flex items-center gap-1 text-sm">
                {analytics.variation > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={analytics.variation > 0 ? 'text-green-600' : 'text-red-600'}>
                  {analytics.variation > 0 ? '+' : ''}{analytics.variation}%
                </span>
                <span className="text-muted-foreground">ce mois</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Objectif annuel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{analytics.objectif.toLocaleString()} XAF</div>
              <div className="mt-2">
                <Progress value={progressObjectif} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {progressObjectif.toFixed(1)}% atteint
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-green-700" />
                <span className="text-sm">{analytics.mouvements.length} mouvements</span>
              </div>
              <div className="text-2xl font-bold text-green-900">
                {analytics.mouvements.length}
              </div>
              <p className="text-xs text-muted-foreground">Dernières 24h</p>
            </CardContent>
          </Card>
        </div>

        {/* Répartition des fonds */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-green-900">Répartition des fonds</CardTitle>
            <CardDescription>
              Distribution par type de fonds • {selectedPeriod}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {analytics.repartition.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-background-tertiary rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${item.couleur}`} />
                      <div>
                        <p className="font-medium">{item.type}</p>
                        <p className="text-sm text-muted-foreground">{item.pourcentage}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-900">{item.montant.toLocaleString()} XAF</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center">
                <div className="w-48 h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-green-700 mx-auto mb-2" />
                    <p className="text-sm text-green-800">
                      Graphique circulaire
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mouvements récents */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-900">Mouvements récents</CardTitle>
            <CardDescription>
              Dernières entrées et sorties de fonds • {selectedPeriod}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.mouvements.map((mouvement, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-background-tertiary rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      mouvement.type === 'Entrée' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {mouvement.type === 'Entrée' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{mouvement.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(mouvement.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      mouvement.type === 'Entrée' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {mouvement.montant > 0 ? '+' : ''}{mouvement.montant.toLocaleString()} XAF
                    </p>
                    <Badge variant={mouvement.type === 'Entrée' ? 'default' : 'destructive'} className={
                      mouvement.type === 'Entrée' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''
                    }>
                      {mouvement.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Click outside handler for dropdown */}
      {showPeriodDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowPeriodDropdown(false)}
        />
      )}
    </div>
  );
};

export default EtatFonds;