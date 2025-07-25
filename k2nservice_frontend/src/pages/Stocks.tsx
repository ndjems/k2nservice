import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Package, Search, Filter, AlertTriangle, CheckCircle, X, Loader2 } from 'lucide-react';
import axios from 'axios';

const Stocks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    total_acquis: '',
    quantite: '',
    prix: '',
    categorie: '',
    emplacement: '',
    seuil_min: '',
    seuil_max: ''
  });
  const [mockStocks, setMockStocks] = useState([]);

  // Options pour les selects
  const categories = [
    'Informatique',
    'Mécaninique',
    'Électronique',
    'Mobilier',
    'Fournitures',
    'Équipement'
  ];

  const emplacements = [
    'Entrepôt A',
    'Entrepôt B',
    'Entrepôt C',
    'Entrepôt D',
    'Bureau Principal',
    'Magasin'
  ];

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get('http://localhost:9001/stocks');
        setMockStocks(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des stocks:', error);
      }
    };

    fetchStocks();
  }, []);

  const totalValeur = mockStocks.reduce((sum, stock) => sum + (stock.quantite * stock.prix), 0);
  const stocksFaibles = mockStocks.filter(s => s.status === 'Faible' || s.status === 'Critique').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'OK':
        return 'bg-success text-success-foreground';
      case 'Faible':
        return 'bg-warning text-warning-foreground';
      case 'Critique':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OK':
        return <CheckCircle className="w-4 h-4" />;
      case 'Faible':
      case 'Critique':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Préparer les données pour l'API
      const dataToSend = {
        nom: formData.nom,
        total_acquis: parseInt(formData.total_acquis),
        quantite: parseInt(formData.quantite),
        prix: parseFloat(formData.prix),
        categorie: formData.categorie,
        emplacement: formData.emplacement,
        seuil_min: parseInt(formData.seuil_min),
        seuil_max: parseInt(formData.seuil_max)
      };

      console.log('Données à envoyer:', dataToSend);

      // Envoyer la requête POST
      const response = await axios.post('http://localhost:9001/stocks', dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Produit créé avec succès:', response.data);
      
      // Rafraîchir la liste des stocks
      const updatedStocks = await axios.get('http://localhost:9001/stocks');
      setMockStocks(updatedStocks.data);
      
      // Réinitialiser le formulaire
      setShowForm(false);
      setFormData({
        nom: '',
        total_acquis: '',
        quantite: '',
        prix: '',
        categorie: '',
        emplacement: '',
        seuil_min: '',
        seuil_max: ''
      });

      // Optionnel: Afficher un message de succès
      alert('Produit ajouté avec succès !');

    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      alert('Erreur lors de l\'ajout du produit. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      nom: '',
      total_acquis: '',
      quantite: '',
      prix: '',
      categorie: '',
      emplacement: '',
      seuil_min: '',
      seuil_max: ''
    });
  };

  return (
    <div className="min-h-screen bg-background-secondary">
      <DashboardHeader onSearch={setSearchQuery} />
      
      <main className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Package className="w-8 h-8" />
              Stocks
            </h1>
            <p className="text-muted-foreground">
              Gestion et suivi des stocks
            </p>
          </div>
          <Button 
            className="gap-2" 
            onClick={() => setShowForm(true)}
            style={{ backgroundColor: '#095228' }}
          >
            <Plus className="w-4 h-4" />
            Ajouter un produit
          </Button>
        </div>

        {/* Formulaire d'ajout complet */}
        {showForm && (
          <Card className="mb-6" style={{ borderColor: '#095228' }}>
            <CardHeader style={{ backgroundColor: '#095228', color: 'white' }}>
              <CardTitle className="flex items-center justify-between">
                <span>Ajouter un nouveau produit</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="text-white hover:bg-white/20"
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
              <CardDescription className="text-white/80">
                Remplissez toutes les informations du produit
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Première ligne */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="nom" className="text-sm font-medium text-foreground">
                      Nom du produit *
                    </label>
                    <Input
                      id="nom"
                      type="text"
                      value={formData.nom}
                      onChange={(e) => handleInputChange('nom', e.target.value)}
                      placeholder="Ex: Ordinateur portable"
                      required
                      disabled={isSubmitting}
                      className="focus:ring-2 focus:ring-[#095228] focus:border-[#095228]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="total_acquis" className="text-sm font-medium text-foreground">
                      Total acquis *
                    </label>
                    <Input
                      id="total_acquis"
                      type="number"
                      min="0"
                      value={formData.total_acquis}
                      onChange={(e) => handleInputChange('total_acquis', e.target.value)}
                      placeholder="Ex: 200"
                      required
                      disabled={isSubmitting}
                      className="focus:ring-2 focus:ring-[#095228] focus:border-[#095228]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="quantite" className="text-sm font-medium text-foreground">
                      Quantité actuelle *
                    </label>
                    <Input
                      id="quantite"
                      type="number"
                      min="0"
                      max={formData.total_acquis || undefined}
                      value={formData.quantite}
                      onChange={(e) => handleInputChange('quantite', e.target.value)}
                      placeholder="Ex: 45"
                      required
                      disabled={isSubmitting}
                      className="focus:ring-2 focus:ring-[#095228] focus:border-[#095228]"
                    />
                  </div>
                </div>

                {/* Deuxième ligne */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="prix" className="text-sm font-medium text-foreground">
                      Prix unitaire (XAF) *
                    </label>
                    <Input
                      id="prix"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.prix}
                      onChange={(e) => handleInputChange('prix', e.target.value)}
                      placeholder="Ex: 600000"
                      required
                      disabled={isSubmitting}
                      className="focus:ring-2 focus:ring-[#095228] focus:border-[#095228]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="categorie" className="text-sm font-medium text-foreground">
                      Catégorie *
                    </label>
                    <Select 
                      value={formData.categorie} 
                      onValueChange={(value) => handleInputChange('categorie', value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="focus:ring-2 focus:ring-[#095228] focus:border-[#095228]">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="emplacement" className="text-sm font-medium text-foreground">
                      Emplacement *
                    </label>
                    <Select 
                      value={formData.emplacement} 
                      onValueChange={(value) => handleInputChange('emplacement', value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="focus:ring-2 focus:ring-[#095228] focus:border-[#095228]">
                        <SelectValue placeholder="Sélectionner un emplacement" />
                      </SelectTrigger>
                      <SelectContent>
                        {emplacements.map((emp) => (
                          <SelectItem key={emp} value={emp}>
                            {emp}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Troisième ligne - Seuils */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="seuil_min" className="text-sm font-medium text-foreground">
                      Seuil minimum *
                    </label>
                    <Input
                      id="seuil_min"
                      type="number"
                      min="0"
                      value={formData.seuil_min}
                      onChange={(e) => handleInputChange('seuil_min', e.target.value)}
                      placeholder="Ex: 10"
                      required
                      disabled={isSubmitting}
                      className="focus:ring-2 focus:ring-[#095228] focus:border-[#095228]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Quantité en dessous de laquelle une alerte sera générée
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="seuil_max" className="text-sm font-medium text-foreground">
                      Seuil maximum *
                    </label>
                    <Input
                      id="seuil_max"
                      type="number"
                      min={formData.seuil_min || "0"}
                      value={formData.seuil_max}
                      onChange={(e) => handleInputChange('seuil_max', e.target.value)}
                      placeholder="Ex: 100"
                      required
                      disabled={isSubmitting}
                      className="focus:ring-2 focus:ring-[#095228] focus:border-[#095228]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Capacité maximale de stockage pour ce produit
                    </p>
                  </div>
                </div>

                {/* Résumé */}
                {formData.quantite && formData.prix && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Résumé</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Valeur stock actuel:</span>
                        <span className="font-medium ml-2">
                          {(parseInt(formData.quantite || 0) * parseFloat(formData.prix || 0)).toLocaleString()} XAF
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Valeur totale potentielle:</span>
                        <span className="font-medium ml-2">
                          {(parseInt(formData.total_acquis || 0) * parseFloat(formData.prix || 0)).toLocaleString()} XAF
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    style={{ backgroundColor: '#095228' }}
                    className="hover:bg-[#0a5e2e]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Ajout en cours...
                      </>
                    ) : (
                      'Ajouter le produit'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Valeur totale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalValeur.toLocaleString()} XAF</div>
              <p className="text-xs text-muted-foreground">En stock</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Produits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStocks.length}</div>
              <p className="text-xs text-muted-foreground">Références</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Stocks faibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stocksFaibles}</div>
              <p className="text-xs text-muted-foreground">Nécessitent attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Emplacements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(mockStocks.map(s => s.emplacement)).size}
              </div>
              <p className="text-xs text-muted-foreground">Entrepôts</p>
            </CardContent>
          </Card>
        </div>

        {/* Alertes stocks */}
        {stocksFaibles > 0 && (
          <Card className="mb-6 border-warning">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <AlertTriangle className="w-5 h-5" />
                Alertes stock
              </CardTitle>
              <CardDescription>
                Produits nécessitant un réapprovisionnement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockStocks.filter(s => s.status === 'Faible' || s.status === 'Critique').map((stock) => (
                  <div key={stock.id} className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(stock.status)}
                      <div>
                        <p className="font-medium">{stock.nom}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock actuel: {stock.quantite} / Seuil minimum: {stock.seuilMin}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Commander
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un produit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filtrer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stocks table */}
        <Card>
          <CardHeader>
            <CardTitle>Inventaire</CardTitle>
            <CardDescription>
              Liste complète des produits en stock
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Prix unitaire</TableHead>
                  <TableHead>Valeur totale</TableHead>
                  <TableHead>Emplacement</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStocks.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell className="font-medium">{stock.id}</TableCell>
                    <TableCell>{stock.nom}</TableCell>
                    <TableCell>{stock.categorie}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{stock.quantite}</span>
                        <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              stock.quantite <= stock.seuilMin ? 'bg-destructive' : 
                              stock.quantite <= stock.seuilMin * 1.5 ? 'bg-warning' : 
                              'bg-success'
                            }`}
                            style={{ width: `${Math.min((stock.quantite / stock.seuilMax) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{stock.prix.toLocaleString()} XAF</TableCell>
                    <TableCell className="font-medium">
                      {(stock.quantite * stock.prix).toLocaleString()} XAF
                    </TableCell>
                    <TableCell>{stock.emplacement}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(stock.status)}>
                        {stock.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Stocks;